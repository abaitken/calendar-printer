from typing import Iterator

from .YearMonth import YearMonth
from .CalendarEvent import CalendarEvent

class EventCalendar:
    def __init__(self, dates: list[CalendarEvent]):
        self._dates = dates
    
    def FindAll(self, intersect: YearMonth) -> Iterator[CalendarEvent]:
        for item in self._dates:
            if item.date.Intersects(intersect):
                yield item
                