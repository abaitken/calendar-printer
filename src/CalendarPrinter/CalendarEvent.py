from .PartialDate import PartialDate

class CalendarEvent:
    def __init__(self, jobj):
        self.date = PartialDate.Parse(jobj['date'])
        self.text = jobj['text']
        self.tags = jobj['tags']
