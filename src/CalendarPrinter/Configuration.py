from .CalendarEvent import CalendarEvent
from .CalendarOutputFormat import CalendarOutputFormat
from .CalendarOutputStyle import CalendarOutputStyle
from .DateRange import DateRange
from .TagMapping import TagMapping

class Configuration:
    def __init__(self, jobj):
        
        self.dates = []
        for event in jobj['dates']:
            self.dates.append(CalendarEvent(event))
        
        self.range = DateRange(jobj['range'])
        self.format = CalendarOutputFormat.from_str(jobj['format'])
        self.style = CalendarOutputStyle.from_str(jobj['style'])
        
        self.tag_mapping = []
        for mapping in jobj['tag-mapping']:
            self.tag_mapping.append(TagMapping(mapping))

        self.important_tags = jobj['important-tags']