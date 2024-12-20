from datetime import date, timedelta
from typing import Optional
from .YearMonth import YearMonth

class PartialDate:

    @staticmethod
    def Parse(s: str) -> 'PartialDate':    
        parts = s.split('-')

        if len(parts) > 3:
            raise ValueError("Input string contains more than 3 parts")

        year = PartialDate.__ParseYear(parts[0])
        month = PartialDate.__ParseMonth(parts[1]) if len(parts) > 1 else None
        day = PartialDate.__ParseDay(parts[2]) if len(parts) > 2 else None
        return PartialDate(year, month, day)

    @staticmethod
    def __ParseYear(s: str) -> Optional[int]:
        if len(s) != 4:
            raise ValueError("Expected 4 characters denoting year")
            
        if s == '####':
            return None

        if s.isnumeric():
            return int(s)
        
        raise ValueError('Unable to parse year')

    @staticmethod
    def __ParseMonth(s: str) -> Optional[int]:
        if len(s) != 2:
            raise ValueError("Expected 2 characters denoting month")
            
        if s == '##':
            return None

        if s.isnumeric():
            return int(s)
        
        raise ValueError('Unable to parse month')

    @staticmethod
    def __ParseDay(s: str) -> Optional[int]:
        #if len(s) != 2:
        #    raise ValueError("Expected 2 characters denoting day")
            
        if s == '##':
            return None
            
        if s == '>>':
            return s
            
        if s == 'MON':
            return s
            
        if s == 'TUE':
            return s
            
        if s == 'WED':
            return s
            
        if s == 'THU':
            return s
            
        if s == 'FRI':
            return s
            
        if s == 'SAT':
            return s
            
        if s == 'SUN':
            return s

        if s.isnumeric():
            return int(s)
        
        raise ValueError('Unable to parse day')
        
    def __init__(self, year: Optional[int], month: Optional[int], day: Optional[int]):
        if year is None and month is None and day is None:
            raise ValueError('At least one argument must have a value')

        self._year = year
        self._month = month
        self._day = day
        
    def _IntersectsPartialDate(self, date: 'PartialDate') -> bool:
        if self._year is not None and self._year != date._year:
            return False
        if self._month is not None and self._month != date._month:
            return False
        if self._day is not None and self._day != date._day:
            return False
        
        return True
        
    def _IntersectsDate(self, date: date) -> bool:
        if self._year is not None and self._year != date.year:
            return False
        if self._month is not None and self._month != date.month:
            return False
        if self._day is not None:
            if self._day == 'MON':
                return (date.isoweekday() == 1)
            if self._day == 'TUE':
                return (date.isoweekday() == 2)
            if self._day == 'WED':
                return (date.isoweekday() == 3)
            if self._day == 'THU':
                return (date.isoweekday() == 4)
            if self._day == 'FRI':
                return (date.isoweekday() == 5)
            if self._day == 'SAT':
                return (date.isoweekday() == 6)
            if self._day == 'SUN':
                return (date.isoweekday() == 7)
            
            if self._day == '>>':
                # Add day onto given date, if overflows to next month then it is the last day
                nextday = date + timedelta(1)
                if nextday.month == date.month:
                    return False
                
                return True
            
            if self._day != date.day:
                return False
            return True
        
        return True
        
    def _IntersectsYearMonth(self, date: YearMonth) -> bool:
        if self._year is not None and self._year != date.year:
            return False
        if self._month is not None and self._month != date.month:
            return False
        
        return True
        
    def Intersects(self, value: 'YearMonth | date | PartialDate') -> bool:
        if isinstance(value, YearMonth):
            return self._IntersectsYearMonth(value)
        if isinstance(value, date):
            return self._IntersectsDate(value)
        if isinstance(value, PartialDate):
            return self._IntersectsPartialDate(value)
        
        raise TypeError()
    
    def equals(self, other: 'YearMonth') -> bool:
        # TODO : Review this equality
        return (self._year == other._year and self._month == other._month and self._day == None)

    def __eq__(self, other: 'YearMonth') -> bool:
        return self.equals(other)

    def __ne__(self, other: 'YearMonth') -> bool:
        return not self.equals(other)