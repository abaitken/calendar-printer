import re
from .CalendarEvent import CalendarEvent
from .PartialDate import PartialDate

class EventMapping:
    def __init__(self, jobj):
        self.match = re.compile(jobj['match'], re.IGNORECASE)
        self.date = PartialDate.Parse(jobj['date']) if 'date' in jobj else None
        self.text = jobj['text'] if 'text' in jobj else None
        self.tags = jobj['tags']

    def IsMatch(self, event: CalendarEvent) -> bool:
        match = self.match.search(event.text)
        if match is None:
            return False
        
        if self.date is not None and not self.date.Intersects(event.date):
            return False

        return True