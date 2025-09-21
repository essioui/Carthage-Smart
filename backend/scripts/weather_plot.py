import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from meteostat import Point, Daily
import pandas as pd
from datetime import timedelta
import io
import base64
import sys

locations = {
    "Tunis": (51.5072, -0.1276, 35),
    "Rades": (51.5400, 0.0026, 15),
    "Manouba": (51.4927, -0.2230, 10),
    "Ariana": (51.5416, -0.1433, 20),
    "Ben Arous": (51.3762, -0.0982, 45),
    "Marsa": (51.4875, -0.1687, 5),
}

def plot_weather(place: str, csv_path: str):
    if place not in locations:
        raise ValueError("Unknown place")

    df = pd.read_csv(csv_path)
    if 'date' not in df.columns:
        raise KeyError("'date' column not found in CSV")
    df['date'] = pd.to_datetime(df['date'])
    
    last_date = df['date'].max()
    start_date = last_date
    end_date = last_date + timedelta(days=30)

    lat, lon, alt = locations[place]
    point = Point(lat, lon, alt)
    data = Daily(point, start_date, end_date).fetch()
    data = data.fillna(method='ffill')

    plt.figure(figsize=(16,6))
    plt.plot(data.index, data['tmax'], label=f"{place} tmax", linestyle='-')
    plt.plot(data.index, data['tmin'], label=f"{place} tmin", linestyle='--')
    plt.xlabel("Date")
    plt.ylabel("Temperature (°C)")
    plt.title(f"Daily tmax and tmin for {place} (Next 30 days)")
    plt.legend()
    plt.grid(True)

    total_days = (end_date - start_date).days
    step = 5
    x_ticks = [start_date + timedelta(days=i) for i in range(0, total_days+1, step)]
    plt.xticks(x_ticks, [d.strftime("%d %b") for d in x_ticks], rotation=45)

    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=150)
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close()

    print(img_base64)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python weather_plot.py <place> <csv_path>")
        sys.exit(1)
    place_arg = sys.argv[1]
    csv_path_arg = sys.argv[2]
    plot_weather(place_arg, csv_path_arg)
