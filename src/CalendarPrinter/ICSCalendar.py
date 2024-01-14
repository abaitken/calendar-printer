from typing import Iterator
from enum import IntEnum
from datetime import date, timedelta

class ParseState(IntEnum):
    SeekCalendar = 1,
    SeekEvent = 2,
    ProcessEvent = 3

class ICSCalendar:
    def __init__(self, events):
        if events is None:
            raise ValueError()
        self.events = events
    
    def ParseDate(value: str) -> date:
        year = value[:4]
        month = value[4:6]
        day = value[6:8]
        return date(int(year), int(month), int(day))

    def Parse(icsfile, settings) -> Iterator['ICSCalendar']:
        
        with open(icsfile) as file:
            state = ParseState.SeekCalendar

            events = None
            while line := file.readline():
                
                match state:
                    case ParseState.SeekCalendar:
                        if line.startswith('BEGIN:VCALENDAR'):
                            events = []
                            state = ParseState.SeekEvent
                            continue
                    
                    case ParseState.SeekEvent:
                        if line.startswith('BEGIN:VEVENT'):
                            state = ParseState.ProcessEvent
                            events.append({})
                            continue
                        if line.startswith('END:VCALENDAR'):
                            state = ParseState.SeekCalendar
                            yield ICSCalendar(events)
                            events = None
                            continue

                        # ignore all other attributes
                        continue
                    
                    case ParseState.ProcessEvent:
                        if line.startswith('END:VEVENT'):
                            state = ParseState.SeekEvent
                            continue

                        current_event = events[-1]
                        
                        if line.startswith('DTEND'):
                            #DTEND;VALUE=DATE:20180102
                            (attribute, value) = line.split(':', 1)
                            current_event['end'] = ICSCalendar.ParseDate(value)                            
                            current_event['end'] += timedelta(days = settings['adjust-end'])
                            continue
                        
                        if line.startswith('DTSTART'):
                            #DTSTART;VALUE=DATE:20180101
                            (attribute, value) = line.split(':', 1)
                            current_event['start'] = ICSCalendar.ParseDate(value)
                            continue
                        
                        if line.startswith('SUMMARY'):
                            #SUMMARY:New Year’s Day
                            (attribute, value) = line.split(':', 1)
                            current_event['text'] = value
                            continue
                        
                        # ignore all other attributes
                        continue
                