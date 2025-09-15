#!/usr/bin/env python3
"""
User Consumption Prediction with Trend, Seasonal & Cyclical decomposition
"""
import os
import sys
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import joblib
import traceback
from statsmodels.tsa.seasonal import STL

# hidden alert of TensorFlow from CUDA/GPU
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
from tensorflow.keras.models import load_model


def predict_user_consumption(user_df: pd.DataFrame, window_size: int = 180, output_days: int = 90):
    features = ["consumption", "tmin", "tmax"]

    # Load scaler used during model training
    scaler_path = os.path.join(os.path.dirname(__file__), "../generalModels/scaler.save")
    scaler = joblib.load(scaler_path)

    # Prepare features and scale them
    df_features = user_df[features].copy()
    scaled_data = scaler.transform(df_features)

    # Load LSTM model
    model_path = os.path.join(os.path.dirname(__file__), "../generalModels/lstm_consumption_model.keras")
    model = load_model(model_path)

    # Autoregressive prediction
    last_seq = scaled_data[-window_size:]
    preds_scaled = []

    while len(preds_scaled) < output_days:
        pred = model.predict(last_seq[np.newaxis, :, :], verbose=0)[0]
        remaining = output_days - len(preds_scaled)
        preds_scaled.extend(pred[:remaining])

        # Update sequence
        for p in pred[:remaining]:
            new_row = last_seq[-1].copy()
            new_row[0] = p
            last_seq = np.vstack([last_seq[1:], new_row])

    preds_scaled = np.array(preds_scaled)

    # Reverse scaling for consumption
    min_c = scaler.data_min_[0]
    max_c = scaler.data_max_[0]
    preds_rescaled = preds_scaled * (max_c - min_c) + min_c

    return preds_rescaled


def build_results(user_df: pd.DataFrame, predictions: np.ndarray) -> dict:
    last_date = user_df["date"].max()
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=len(predictions))
    predicted_dict = {d.strftime("%Y-%m-%d"): float(v) for d, v in zip(future_dates, predictions)}
    return {
        "predicted": predicted_dict,
        "dates_predicted": [d.strftime("%Y-%m-%d") for d in future_dates]
    }


def save_plot(user_df: pd.DataFrame, predictions: np.ndarray, csv_path: str, window_size: int = 180, output_dir="users_plot"):
    os.makedirs(output_dir, exist_ok=True)
    plt.figure(figsize=(14, 8))

    # Combine last 180 days actual with predictions
    actual_data = user_df["consumption"].values[-window_size:]
    actual_dates = user_df["date"].values[-window_size:]
    future_dates = pd.date_range(start=user_df["date"].max() + pd.Timedelta(days=1), periods=len(predictions))

    full_values = np.concatenate([actual_data, predictions])
    full_dates = np.concatenate([actual_dates, future_dates])

    # STL decomposition for trend + seasonal + cyclical
    df_full = pd.DataFrame({"date": full_dates, "consumption": full_values})
    df_full.set_index("date", inplace=True)
    stl = STL(df_full["consumption"], period=30)  # assuming monthly seasonality
    res = stl.fit()

    # Plot all in one figure
    plt.plot(df_full.index, df_full["consumption"], label="Consumption", color="blue")
    plt.plot(df_full.index, res.trend, label="Trend", color="green")
    plt.plot(df_full.index, res.seasonal, label="Seasonal", color="orange")
    plt.plot(df_full.index, res.resid, label="Cyclical", color="red")
    plt.xlabel("Date")
    plt.ylabel("Consumption")
    plt.title("Consumption with Trend, Seasonal & Cyclical")
    plt.legend()
    plt.tight_layout()

    client_name = os.path.splitext(os.path.basename(csv_path))[0]
    plot_path = os.path.join(output_dir, f"{client_name}_trend_seasonal_cyclical.png")
    plt.savefig(plot_path)
    plt.close()
    return plot_path


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="User Consumption Prediction with Trend & Seasonal & Cyclical")
    parser.add_argument("csv_path", help="Path to user CSV file")
    parser.add_argument("--days", type=int, default=90, choices=[30, 60, 90], help="Number of days to predict")
    args = parser.parse_args()

    csv_path = args.csv_path
    output_days = args.days

    if not os.path.exists(csv_path):
        print(json.dumps({"error": f"CSV not found: {csv_path}"}))
        sys.exit(1)

    try:
        df_user = pd.read_csv(csv_path, parse_dates=["date"]).dropna().sort_values("date")
        if len(df_user) < 10:
            raise ValueError("Data too small for prediction")

        predictions = predict_user_consumption(df_user, output_days=output_days)
        results = build_results(df_user, predictions)
        results["days_predicted"] = output_days

        plot_file = save_plot(df_user, predictions, csv_path)
        results["plot_path"] = plot_file

        # Save JSON in the same folder as users_plot
        json_path = os.path.join("users_plot", f"{os.path.splitext(os.path.basename(csv_path))[0]}_results.json")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=4)
        results["json_path"] = json_path

        print(json.dumps(results, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "trace": traceback.format_exc()
        }, ensure_ascii=False))
        sys.exit(1)
