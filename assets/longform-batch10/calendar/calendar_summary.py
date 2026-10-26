#!/usr/bin/env python3
"""Summarize complete fictional property-month calendars. No network calls."""
import argparse
import calendar
from collections import defaultdict, Counter
import csv
import datetime
from decimal import Decimal, ROUND_HALF_UP
import json
from pathlib import Path
import re

def percentage(numerator, denominator):
    if denominator == 0:
        return None
    return str((Decimal(numerator) * 100 / Decimal(denominator)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))

def summarize(path):
    path = Path(path)
    if path.stat().st_size > 2_000_000:
        raise ValueError('CSV exceeds the two-megabyte example limit')
    groups = defaultdict(dict)
    count = 0
    with path.open(encoding='utf-8', newline='') as stream:
        reader = csv.DictReader(stream)
        if reader.fieldnames != ['property_id', 'date', 'status']:
            raise ValueError('Expected headers: property_id,date,status')
        for row in reader:
            count += 1
            if count > 10000:
                raise ValueError('CSV exceeds the 10,000-row example limit')
            if None in row or any(not isinstance(row.get(k), str) or not row[k].strip() for k in reader.fieldnames):
                raise ValueError('Every row needs three nonempty fields')
            property_id, raw_date, status = (row[k].strip() for k in reader.fieldnames)
            if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', raw_date):
                raise ValueError('Dates must use YYYY-MM-DD')
            day = datetime.date.fromisoformat(raw_date)
            if status not in {'booked', 'open', 'blocked', 'unknown'}:
                raise ValueError('Unexpected status: ' + status)
            key = (property_id, day.year, day.month)
            if day.day in groups[key]:
                raise ValueError('Duplicate property-date: ' + property_id + ' ' + raw_date)
            groups[key][day.day] = status
    if not count:
        raise ValueError('No calendar rows supplied')
    results = []
    for (property_id, year, month), days in sorted(groups.items()):
        total = calendar.monthrange(year, month)[1]
        if set(days) != set(range(1, total + 1)):
            raise ValueError('Incomplete represented month: ' + property_id + ' ' + str(year) + '-' + str(month).zfill(2))
        counts = Counter(days.values())
        eligible = counts['booked'] + counts['open']
        results.append({'property_id': property_id, 'month': f'{year:04d}-{month:02d}', 'calendar_nights': total,
                        'booked': counts['booked'], 'open': counts['open'], 'blocked': counts['blocked'], 'unknown': counts['unknown'],
                        'known_eligible_nights': eligible, 'known_eligible_occupancy_pct': percentage(counts['booked'], eligible),
                        'calendar_booked_share_pct': percentage(counts['booked'], total), 'conditional_on_known_statuses': bool(counts['unknown'])})
    return results

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('csv_file')
    args = parser.parse_args()
    try:
        result = summarize(args.csv_file)
    except (ValueError, OSError, csv.Error) as exc:
        parser.exit(2, 'Input error: ' + str(exc) + '\n')
    print(json.dumps(result, indent=2))

if __name__ == '__main__':
    main()
