#!/usr/bin/env python3
"""
Analyze consumption from a CSV file and return JSON with:
- Description of totalConsumption
- List of contactIds below 25%
- List of contactIds above 75%
"""

import sys
import json
import pandas as pd

def analyze_csv(file_path: str):
    # Read the file
    df = pd.read_csv(file_path)

    # Data description
    description = df["totalConsumption"].describe().to_dict()

    # Quartiles Calculation
    q25 = df["totalConsumption"].quantile(0.25)
    q75 = df["totalConsumption"].quantile(0.75)

    # Extract contactIds
    low_consumers = df[df["totalConsumption"] < q25]["contactId"].tolist()
    high_consumers = df[df["totalConsumption"] > q75]["contactId"].tolist()

    # Preparing the result
    result = {
        "description": description,
        "low_consumers": low_consumers,
        "high_consumers": high_consumers
    }

    # Print JSON to stdout
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "CSV file path required"}))
        sys.exit(1)

    file_path = sys.argv[1]
    analyze_csv(file_path)
