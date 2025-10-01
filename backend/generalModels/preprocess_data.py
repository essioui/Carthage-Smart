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

df['date'] = pd.to_datetime(df['date'])
# ==> convert to datetime

df['consumption'] = df['consumption'].str.strip().replace("Null", 0).astype(float)
# ==> remove whitespace, replace "Null" with 0, convert to float

print(df.columns)
# ==> Index(['date', 'KWH'], dtype='object')

df.set_index('date', inplace=True)
# ==> date is index

df = df.resample('D').sum()
# ==> convert half-hour to daily

start_date = df.index.min()
# ==> start date of csv: 2012-04-25

end_date = df.index.max()
# ==> end date of csv: 2014-02-28

chelsea = Point(51.4875, -0.1687)
# ==> location of Chelsea (for example place from london)

data = Daily(chelsea, start_date, end_date).fetch()
# ==> fetch daily weather data from meteostat

print(data.columns)
# ==> Index(['tavg', 'tmin', 'tmax', 'prcp', 'snow', 'wdir', 'wspd', 'wpgt', 'pres', 'tsun'], dtype='object')

data = data[["tavg", "tmin", "tmax", "prcp", "wspd"]]
print(data.columns)
# ==> Index(['tavg', 'tmin', 'tmin', 'prcp', 'wspd'], dtype='object')

data = data.reset_index()
# ==> reset the index to column

data = data.rename(columns={'time': 'date'})
# ==> rename time to date for preprocess to merge

df = df.reset_index()
# ==> reset the index to column

merged_files = pd.merge(df, data, on='date', how='inner')
# ==> merge 2 tables df and data by same column date with type inner join

merged_files = merged_files[['date', 'consumption', 'tavg', 'tmin', 'tmax']]
# ==> just the columns i used

merged_files = merged_files.fillna(merged_files.mean(numeric_only=True))
# ==> change NaN by mean of column

merged_files.to_csv("newData.csv")
# ==> save to csv file