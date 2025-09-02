import sys
import json
import pandas as pd

if __name__ == "__main__":
    # Fetch daily data from argument
    input_data = json.loads(sys.argv[1])

    # Convert to DataFrame
    df = pd.DataFrame(input_data)
    df['date'] = pd.to_datetime(df['date'])

    # Extract year and month in YYYY-MM format
    df['year_month'] = df['date'].dt.strftime('%Y-%m')

    # Aggregate data monthly
    monthly = df.groupby('year_month').agg(
        total_kwh=('consumption', 'sum')
    ).reset_index()

    # Print the result as JSON
    print(json.dumps(monthly.to_dict(orient='records')))
