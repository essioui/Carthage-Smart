from meteostat import Point, Daily
import pandas as pd

df = pd.read_csv('original_data.csv')
print(df.columns)
# ==> list of columns: Index(['LCLid', 'stdorToU', 'DateTime', 'KWH/hh (per half hour) '], dtype='object')

df = df[['DateTime', 'KWH/hh (per half hour) ']]
print(df.columns)
# ==>Index(['DateTime', 'KWH/hh (per half hour) '], dtype='object')

df = df.rename(columns={'KWH/hh (per half hour) ': 'consumption',
                        'DateTime': 'date'
                        })
print(df.head())

df['date'] = pd.to_datetime(df['date'].str.strip(), errors='coerce')
# ==> convert to datetime and strip any whitespace and NaT to NaT

df['consumption'] = pd.to_numeric(df['consumption'].str.strip(), errors='coerce')
# ==> convert to numeric and strip any whitespace and NaN to NaN

print(df.dtypes)
# ==> Index(['date', 'KWH'], dtype='object')

df.set_index('date', inplace=True)
# ==> date is index

df = df.resample('D').sum()
# ==> convert half-hour to daily

print(df.head())

start_date = df.index.min()
# ==> first date from csv: 2012-04-25 

last_date = df.index.max()
# ==> last date from csv: 2014-02-28 

chelsea = Point(51.4875, -0.1687)
# ==> location of Chelsea

data = Daily(chelsea, start_date, last_date).fetch()
# ==> fetch daily data from meteostat with cols:tavg  tmin  tmax  prcp  snow  wdir  wspd  wpgt    pres  tsun

data = data[['tavg', 'tmin', 'tmax', 'prcp', 'wspd']]
# ==> choose just clos: tavg  tmin  tmax  prcp  wspd

df = df.reset_index()
# ==> reset index to column (for merge later)

data = data.reset_index()
# ==> reset index to column (for merge later)

data = data.rename(columns={'time': 'date'})
# ==> rename time to date

merge_data = pd.merge(df, data, on='date', how='inner')

merge_data = merge_data.set_index('date')

merge_data.to_csv('processed_data.csv')

print(merge_data.head())

print(merge_data.tail())