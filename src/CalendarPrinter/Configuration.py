import json
import os
from datetime import timedelta

from .CalendarEvent import CalendarEvent
from .CalendarOutputFormat import CalendarOutputFormat
from .CalendarOutputStyle import CalendarOutputStyle
from .DateRange import DateRange
from .TagMapping import TagMapping
from .ICSCalendar import ICSCalendar
from .PartialDate import PartialDate
from .EventMapping import EventMapping

class Configuration:
    def __init__(self):
        pass

    def Load(configurationFile) -> 'Configuration':
        
        f = open(configurationFile, 'r')
        jobj = json.load(f)
        f.close()

        result = Configuration()
        result.dates = []
        for event in jobj['dates']:
            result.dates.append(CalendarEvent.FromJSON(event))

        (configurationDir, filename) = configurationFile.rsplit(os.sep, 1)

        for item in jobj['ics']:
            icsfile = os.path.join(configurationDir, item['filename'])

            settings = {
                "adjust-end": 0,
                "adjust-start": 0
            }

            if 'parse' in item:
                parserSettings = item['parse']
                settings['adjust-end'] = parserSettings['adjust-end'] if 'adjust-end' in parserSettings else settings['adjust-end']
                settings['adjust-start'] = parserSettings['adjust-start'] if 'adjust-start' in parserSettings else settings['adjust-start']

            icscalendar = ICSCalendar.Parse(icsfile, settings)

            for calendar in icscalendar:
                for event in calendar.events:
                    date = event['start']
                    while date <= event['end']:
                        result.dates.append(CalendarEvent(PartialDate(date.year, date.month, date.day), event['text'], item['tags']))
                        date += timedelta(days = 1)
        
        result.range = DateRange(jobj['range'])
        result.format = CalendarOutputFormat.from_str(jobj['format'])
        result.style = CalendarOutputStyle.from_str(jobj['style'])
        
        result.tag_mapping = []
        for mapping in jobj['tag-mapping']:
            result.tag_mapping.append(TagMapping(mapping))

        result.important_tags = jobj['important-tags']

        result.event_mapping = []
        for mapping in jobj['event-mapping']:
            result.event_mapping.append(EventMapping(mapping))
        
        result.weeknumbers = False
        if 'weeknumbers' in jobj:
            result.weeknumbers = jobj['weeknumbers']

        return result