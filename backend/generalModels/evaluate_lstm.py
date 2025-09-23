import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
import json
import joblib

plots_dir = "plots"
os.makedirs(plots_dir, exist_ok=True)

df = pd.read_csv("evaluate.csv")
features = ['consumption', 'tmin', 'tmax']
df_selected = df[features]

plt.figure(figsize=(12,6))
df_selected.plot()
plt.xlabel("Index")
plt.ylabel("Values")
plt.title("Consumption, Tmin, Tmax Over Time")
plt.savefig(os.path.join(plots_dir, "original_data.png"))
plt.close()

result = seasonal_decompose(df_selected['consumption'], model='additive', period=365)
plt.figure()
result.plot()
plt.suptitle('Consumption Decomposition')
plt.savefig(os.path.join(plots_dir, "seasonal_decompose.png"))
plt.close()

scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(df_selected)
joblib.dump(scaler, "scaler.save")

n = len(scaled_data)
train_size = int(n * 0.7)
test_size = int(n * 0.15)
evaluate_size = n - train_size - test_size

train = scaled_data[:train_size]
test = scaled_data[train_size:train_size+test_size]
evaluate = scaled_data[train_size+test_size:]

window_size = 180
forecast_horizon = 60

def create_X_y(data, window_size, forecast_horizon):
    if len(data) < window_size + forecast_horizon:
        print(f"Data too small ({len(data)}) for window_size={window_size} and forecast_horizon={forecast_horizon}")
        return np.array([]), np.array([])
    X_list = []
    y_list = []
    for i in range(len(data) - window_size - forecast_horizon + 1):
        X_list.append(data[i:i+window_size])
        y_list.append(data[i+window_size:i+window_size+forecast_horizon])
    X = np.array(X_list)
    y = np.array(y_list)
    y = y.reshape((y.shape[0], y.shape[1]*y.shape[2]))
    return X, y

X_train, y_train = create_X_y(train, window_size, forecast_horizon)
X_test, y_test = create_X_y(test, window_size, forecast_horizon)
X_eval, y_eval = create_X_y(evaluate, window_size, forecast_horizon)

model = Sequential([
    LSTM(128, activation='tanh', return_sequences=True, input_shape=(window_size, 3)),
    Dropout(0.2),
    LSTM(64, activation='tanh', return_sequences=True),
    Dropout(0.2),
    LSTM(32, activation='tanh'),
    Dense(forecast_horizon*3)
])

optimizer = Adam(learning_rate=0.001)
model.compile(optimizer=optimizer, loss='mse', metrics=['mae'])
model.summary()

early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-6)
callbacks = [early_stop, reduce_lr]

if X_test.size > 0:
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=100,
        batch_size=32,
        callbacks=callbacks
    )
else:
    history = model.fit(
        X_train, y_train,
        epochs=100,
        batch_size=32,
        callbacks=callbacks
    )

model.save("lstm_consumption_model.keras")

if X_eval.size > 0:
    loss, mae = model.evaluate(X_eval, y_eval)
    print(f"Evaluate Loss: {loss}, MAE: {mae}")

if X_eval.size > 0:
    sample_X = X_eval[0:1]
    predicted = model.predict(sample_X)
    predicted = predicted.reshape((forecast_horizon, 3))

    plt.figure(figsize=(12,6))
    pred_index = np.arange(len(X_eval[0]), len(X_eval[0])+forecast_horizon)
    for i, feature in enumerate(features):
        actual = evaluate[:forecast_horizon, i]
        plt.plot(pred_index, actual, label=f'Actual {feature}', linestyle='--')
        plt.plot(pred_index, predicted[:, i], label=f'Predicted {feature}')
    plt.xlabel("Index")
    plt.ylabel("Values")
    plt.title(f"Actual vs Predicted for {forecast_horizon} Days")
    plt.legend()
    plt.savefig(os.path.join(plots_dir, "actual_vs_predicted.png"))
    plt.close()
