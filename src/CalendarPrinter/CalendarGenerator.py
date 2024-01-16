from datetime import date, timedelta
from io import TextIOWrapper
from os import path
from typing import Iterator
from .CalendarEvent import CalendarEvent
from .YearMonth import YearMonth
from .Configuration import Configuration
from .DateRange import DateRange
from .TagsToIconConverter import TagsToIconConverter
from .generator_with_current import generator_with_current
from .EventCalendar import EventCalendar

class CalendarCell:
    def __init__(self, date, events):
        self.date = date
        self.events = events

CalendarCell.Empty = CalendarCell(None, None)

class CalendarGenerator:
    def __init__(self):
        pass
        
    def Create(self, range: DateRange, eventCalendar: EventCalendar, tagsToIcon: TagsToIconConverter, configuration: Configuration, outdir: str):
        
        filename = path.join(outdir, self.CreateFilename(range.start.year))
        
        with open(filename, 'w') as writer:
            self.WriteHeader(writer)

            currentMonth = range.start
            pageBreak = False

            while currentMonth <= range.end:
                if pageBreak:
                    self.PageBreak(writer)
                
                self.CreateMonth(currentMonth, eventCalendar, tagsToIcon, configuration, outdir)

                dates = self.BuildMonthDates(currentMonth)
                self.WriteMonth(currentMonth, dates, eventCalendar, tagsToIcon, configuration, writer)
                pageBreak = True
                currentMonth = currentMonth.NextMonth()
            

            self.PageBreak(writer)
            self.WriteFooter(writer)

    def PageBreak(self, writer: TextIOWrapper):
        raise NotImplementedError()

    def CreateMonth(self, month: YearMonth, eventCalendar: EventCalendar, tagsToIcon: TagsToIconConverter, configuration: Configuration, outdir: str):
        
        filename = path.join(outdir, self.CreateMonthFilename(month))
        with open(filename, 'w') as writer:
            dates = self.BuildMonthDates(month)
            self.WriteHeader(writer)
            self.WriteMonth(month, dates, eventCalendar, tagsToIcon, configuration, writer)
            self.WriteFooter(writer)

    def WriteFooter(self, writer: TextIOWrapper):
        raise NotImplementedError()
        
    def WriteHeader(self, writer: TextIOWrapper):
        raise NotImplementedError()
        
    def WriteMonth(self, month: YearMonth, dates: list[date], eventCalendar: EventCalendar, tagsToIcon: TagsToIconConverter, configuration: Configuration, writer: TextIOWrapper):
        raise NotImplementedError()

    def CreateFilename(self, year: int) -> str:
        raise NotImplementedError()
        
    def CreateFilename(self, month: YearMonth) -> str:
        raise NotImplementedError()

    def BuildMonthDates(self, month: YearMonth) -> Iterator[date]:
        delta = timedelta(days = 1)
        current = date(month.year, month.month, 1);

        while current.month == month.month:
            yield current
            current = current + delta

    def CreateCells(self, dates: list[date], eventCalendar: EventCalendar) -> Iterator[CalendarCell]:
        datesEnumerator = generator_with_current(dates)
        if next(datesEnumerator) is None:
            raise GeneratorExit()

        while True:
            yield CalendarCell(datesEnumerator.current,
                list(eventCalendar.FindAll(datesEnumerator.current)))
            
            if next(datesEnumerator) is None:
                break

    def FilterImportant(self, events: Iterator[CalendarEvent], importantTags: list[str]) -> Iterator[CalendarEvent]:
        for item in events:                
            if '*' in importantTags or 'important' in item.tags:
                yield item
                continue
                
            for tag in importantTags:
                if tag in item.tags:
                    yield item
