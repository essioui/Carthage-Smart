import sys
import json
import pandas as pd

if __name__ == "__main__":
    input_data = json.load(sys.stdin)

    df = pd.DataFrame(input_data)
    df['date'] = pd.to_datetime(df['date'])
    df['year_month'] = df['date'].dt.strftime('%Y-%m')

    monthly = df.groupby('year_month').agg(total_kwh=('consumption', 'sum')).reset_index()

    print(json.dumps(monthly.to_dict(orient='records')))
