from .CalendarOutputFormat import CalendarOutputFormat
from .CalendarOutputStyle import CalendarOutputStyle
from .CalendarGenerator import CalendarGenerator
from .MonthlyLandscapeSVGGenerator import MonthlyLandscapeSVGGenerator
from .MonthlyLandscapeHTMLGenerator import MonthlyLandscapeHTMLGenerator
from .MonthlyPortraitHTMLGenerator import MonthlyPortraitHTMLGenerator

class GenerationFactory:
    def __init__(self):
        pass
    
    def Create(self, style: CalendarOutputStyle, format: CalendarOutputFormat) -> CalendarGenerator:
        match format:
            case CalendarOutputFormat.HTML:
                return self._CreateHTMLStyleGenerator(style)
            case CalendarOutputFormat.SVG:
                return self._CreateSVGStyleGenerator(style)
        
        raise NotImplementedError()
    
    def _CreateHTMLStyleGenerator(self, style: CalendarOutputStyle) -> CalendarGenerator:
        match style:
            case CalendarOutputStyle.MonthlyLandscape:
                return MonthlyLandscapeHTMLGenerator()
            case CalendarOutputStyle.MonthlyPortrait:
                return MonthlyPortraitHTMLGenerator()
        
        raise NotImplementedError()
        
    def _CreateSVGStyleGenerator(self, style: CalendarOutputStyle) -> CalendarGenerator:
        match style:
            case CalendarOutputStyle.MonthlyLandscape:
                return MonthlyLandscapeSVGGenerator()
        
        raise NotImplementedError()