#!/usr/bin/env python3
"""
Client Consumption Prediction using the saved scaler from the model
"""

import os
import sys
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import joblib
import traceback

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
from tensorflow.keras.models import load_model


def predict_client_consumption(client_df, window_size = 180, output_days = 90):
    features = ["consumption", "tmin", "tmax"]

    scaler_path = os.path.join(os.path.dirname(__file__), "../generalModels/scaler.save")
    scaler = joblib.load(scaler_path)

    client_df_features = client_df[features].copy()
    scaled_data = scaler.transform(client_df_features)

    model_path = os.path.join(os.path.dirname(__file__), "../generalModels/lstm_consumption_model.keras")
    model = load_model(model_path)

    last_sequence = scaled_data[-window_size:]
    predictions_scaled = []

    while len(predictions_scaled) < output_days:
        pred = model.predict(last_sequence[np.newaxis, :, :], verbose=0)[0]
        remaining = output_days - len(predictions_scaled)
        predictions_scaled.extend(pred[:remaining])

        for p in pred[:remaining]:
            new_row = last_sequence[-1].copy()
            new_row[0] = p
            last_sequence = np.vstack([last_sequence[1:], new_row])

    predictions_scaled = np.array(predictions_scaled)

    min_c = scaler.data_min_[0]
    max_c = scaler.data_max_[0]
    predictions_rescaled = predictions_scaled * (max_c - min_c) + min_c

    return predictions_rescaled


def build_results(df_client, predictions):
    last_date = df_client["date"].max()
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=len(predictions))
    predicted_dict = {d.strftime("%Y-%m-%d"): float(v) for d, v in zip(future_dates, predictions)}
    return {
        "predicted": predicted_dict,
        "dates_predicted": [d.strftime("%Y-%m-%d") for d in future_dates]
    }


def save_plot(df_client, predictions, csv_path, window_size = 180, output_dir="clients_plot"):
    os.makedirs(output_dir, exist_ok=True)
    plt.figure(figsize=(12, 6))

    actual_plot_data = df_client["consumption"].values[-window_size:]
    actual_plot_dates = df_client["date"].values[-window_size:]

    future_dates = pd.date_range(start=df_client["date"].max() + pd.Timedelta(days=1), periods=len(predictions))

    full_values = np.concatenate([actual_plot_data, predictions])
    full_dates = np.concatenate([actual_plot_dates, future_dates])

    plt.plot(full_dates, full_values, label="Actual (last 180) + Predicted Consumption")

    plt.xlabel("Date")
    plt.ylabel("Consumption")
    plt.title("Actual (last 180 days) + Predicted Consumption")
    plt.legend()

    client_name = os.path.splitext(os.path.basename(csv_path))[0]
    plot_path = os.path.join(output_dir, f"{client_name}_actual_vs_predicted.png")

    plt.savefig(plot_path)
    plt.close()
    return plot_path


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Client Consumption Prediction")
    parser.add_argument("csv_path", help="Path to client CSV file")
    parser.add_argument("--days", type=int, default=30, choices=[30, 60, 90], help="Number of days to predict")
    args = parser.parse_args()

    csv_path = args.csv_path
    output_days = args.days

    if not os.path.exists(csv_path):
        print(json.dumps({"error": f"CSV not found: {csv_path}"}))
        sys.exit(1)

    try:
        df_client = pd.read_csv(csv_path, parse_dates=["date"]).dropna().sort_values("date")
        if len(df_client) < 10:
            raise ValueError("Data too small for prediction")

        predictions = predict_client_consumption(df_client, output_days=output_days)
        results = build_results(df_client, predictions)
        results["days_predicted"] = output_days

        plot_file = save_plot(df_client, predictions, csv_path)
        results["plot_path"] = plot_file

        print(json.dumps(results, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "trace": traceback.format_exc()
        }, ensure_ascii=False))
        sys.exit(1)
