from .PartialDate import PartialDate

class CalendarEvent:
    def __init__(self, date: PartialDate, text: str, tags: list[str]):
        self.date = date
        self.text = text
        self.tags = tags

    def FromJSON(jobj) -> 'CalendarEvent':
        result = CalendarEvent(PartialDate.Parse(jobj['date']), jobj['text'], jobj['tags'] if 'tags' in jobj else [])
        return result
    
    def AreSimilar(left: 'CalendarEvent', right: 'CalendarEvent') -> bool:
        return (left.date == right.date and left.text == right.text)