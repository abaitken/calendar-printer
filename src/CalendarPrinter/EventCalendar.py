from typing import Iterator
from datetime import date

from .YearMonth import YearMonth
from .CalendarEvent import CalendarEvent
from .EventMapping import EventMapping

class EventCalendar:
    def __init__(self, dates: list[CalendarEvent], eventMappings: list[EventMapping]):
        self._dates = dates
        self._eventMappings = eventMappings
    
    def _FindAll(self, intersect: YearMonth | date) -> Iterator[CalendarEvent]:
        for item in self._dates:
            if item.date.Intersects(intersect):
                yield item
    
    def _Merge(self, events: Iterator[CalendarEvent]) -> Iterator[CalendarEvent]:
        result: list[CalendarEvent] = []
        
        for event in events:

            for mapping in self._eventMappings:
                if mapping.IsMatch(event):
                    event = CalendarEvent(event.date, mapping.text if mapping.text is not None else event.text, mapping.tags)
                    break

            if len(result) == 0:
                result.append(event)
                continue

            if any(item.text.lower() == event.text.lower() for item in result):
                continue

            result.append(event)

        return result

    def FindAll(self, intersect: YearMonth | date) -> Iterator[CalendarEvent]:
        result = self._FindAll(intersect)
        result = self._Merge(result)
        return result