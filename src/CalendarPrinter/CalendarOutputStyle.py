from enum import Enum

class CalendarOutputStyle(Enum):
    MonthlyLandscape = 1
    MonthlyPortrait = 2
    
    @staticmethod
    def from_str(s: str) -> 'CalendarOutputStyle':
        if s in ('monthlylandscape', 'MonthlyLandscape'):
            return CalendarOutputStyle.MonthlyLandscape
            
        if s in ('monthlyportrait', 'MonthlyPortrait'):
            return CalendarOutputStyle.MonthlyPortrait
        
        raise NotImplementedError(s)
    