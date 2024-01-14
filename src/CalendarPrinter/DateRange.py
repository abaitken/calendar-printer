from .YearMonth import YearMonth

class DateRange:
    def __init__(self, jobj):
        self.start = YearMonth.Parse(jobj['start'])
        self.end = YearMonth.Parse(jobj['end'])
