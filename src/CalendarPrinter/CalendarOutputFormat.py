from enum import Enum

class CalendarOutputFormat(Enum):
    HTML = 1
    PNG = 2
    SVG = 3
    
    @staticmethod
    def from_str(s: str) -> 'CalendarOutputFormat':
        if s in ('html', 'HTML'):
            return CalendarOutputFormat.HTML
            
        if s in ('png', 'PNG'):
            return CalendarOutputFormat.PNG
            
        if s in ('svg', 'SVG'):
            return CalendarOutputFormat.SVG
        
        raise NotImplementedError(s)