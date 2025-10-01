import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
import joblib
import itertools

plots_dir = "plots"
os.makedirs(plots_dir, exist_ok=True)

df = pd.read_csv("evaluate.csv")
df['date'] = pd.to_datetime(df['date'])

df['days_week'] = df['date'].dt.dayofweek
df['days_month'] = df['date'].dt.month
df['days_year'] = df['date'].dt.dayofyear

features = ['consumption', 'tmin', 'tmax', 'days_week', 'days_month', 'days_year']
df_selected = df[features]

scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(df_selected)
joblib.dump(scaler, "scaler.save")

n = len(scaled_data)
train_size = int(n * 0.7)
evaluate_size = n - train_size

train = scaled_data[:train_size]
evaluate = scaled_data[train_size:]

val_split = 0.2
val_size = int(len(train) * val_split)

window_size = 120
forecast_horizon = 30
if val_size < window_size + forecast_horizon:
    val_size = window_size + forecast_horizon

train_data = train[:-val_size]
val_data = train[-val_size:]

def create_X_y(data, window_size, forecast_horizon):
    X_list = []
    y_list = []
    for i in range(len(data) - window_size - forecast_horizon + 1):
        X_list.append(data[i:i+window_size])
        y_list.append(data[i+window_size:i+window_size+forecast_horizon, 0])
    X = np.array(X_list)
    y = np.array(y_list)
    return X, y 

X_train, y_train = create_X_y(train_data, window_size, forecast_horizon)
X_val, y_val = create_X_y(val_data, window_size, forecast_horizon)
X_eval, y_eval = create_X_y(evaluate, window_size, forecast_horizon)

print("X_train:", X_train.shape)
print("y_train:", y_train.shape)
print("X_val:", X_val.shape)
print("y_val:", y_val.shape)
print("X_eval:", X_eval.shape)
print("y_eval:", y_eval.shape)

grid_random = {
    "unit1": [128, 256],
    "unit2": [64, 128],
    "unit3": [32, 64],
    "dropout": [0.2, 0.3],
    "lr": [0.01, 0.005]
}

all_grid = list(itertools.product(
    grid_random["unit1"],
    grid_random["unit2"],
    grid_random["unit3"],
    grid_random["dropout"],
    grid_random["lr"]
))

best_val_loss = float("inf")
best_params = None

for (u1, u2, u3, d, lr) in all_grid:

    model = Sequential([
        LSTM(u1, activation='tanh', return_sequences=True, input_shape=(window_size, len(features))),
        Dropout(d),
        LSTM(u2, activation='tanh', return_sequences=True),
        Dropout(d),
        LSTM(u3, activation='tanh'),
        Dense(forecast_horizon)
    ])

    optimizer = Adam(learning_rate=lr)
    model.compile(optimizer=optimizer, loss='mse', metrics=['mae'])
    
    early_stop = EarlyStopping(monitor='val_loss', patience=20, restore_best_weights=True)
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-6)
    callbacks = [early_stop, reduce_lr]

    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=100,
        batch_size=32,
        callbacks=callbacks,
        verbose=1
    )

    val_loss = min(history.history["val_loss"])

    if val_loss < best_val_loss:
        best_val_loss = val_loss
        best_params = (u1, u2, u3, d, lr)
        model.save("lstm_consumption_model.keras")

if X_eval.size > 0:
    loss, mae = model.evaluate(X_eval, y_eval)
    print(f"Evaluate Loss: {loss}, MAE: {mae}")

    sample_X = X_eval[0:1]
    predicted = model.predict(sample_X)
    predicted = predicted.reshape((forecast_horizon,))

    predicted_rescaled = scaler.inverse_transform(
        np.concatenate([predicted.reshape(-1,1), np.zeros((forecast_horizon, len(features)-1))], axis=1)
    )[:,0]

    actual_rescaled = scaler.inverse_transform(
        np.concatenate([evaluate[:forecast_horizon,0].reshape(-1,1),
                        np.zeros((forecast_horizon, len(features)-1))], axis=1)
    )[:,0]

    plt.figure(figsize=(12,6))
    plt.plot(actual_rescaled, label='Actual Consumption', linestyle='--')
    plt.plot(predicted_rescaled, label='Predicted Consumption')
    plt.xlabel("Days")
    plt.ylabel("Consumption")
    plt.title(f"Actual vs Predicted Consumption ({forecast_horizon} days)")
    plt.savefig(os.path.join(plots_dir, "Actual vs Predicted Consumption.png"))
    plt.legend()
    plt.show()
