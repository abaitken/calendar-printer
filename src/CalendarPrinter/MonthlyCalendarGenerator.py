from typing import Iterator
from .CalendarGenerator import CalendarGenerator, CalendarCell
from .DayOfWeek import DayOfWeek
from .generator_with_current import generator_with_current
from .EventCalendar import EventCalendar
   
class MonthlyCalendarGenerator(CalendarGenerator):
    def __init__(self):
        pass

    def BuildWeekdayOrder() -> Iterator[DayOfWeek]:
        yield DayOfWeek.Monday
        yield DayOfWeek.Tuesday
        yield DayOfWeek.Wednesday
        yield DayOfWeek.Thursday
        yield DayOfWeek.Friday
        yield DayOfWeek.Saturday
        yield DayOfWeek.Sunday

    def CalculateCalendarRows(self, dates, eventCalendar: EventCalendar) -> Iterator[list[CalendarCell]]:
        datesEnumerator = generator_with_current(self.CreateCells(dates, eventCalendar))
        if next(datesEnumerator) is None:
            raise GeneratorExit()

        weekdays = list(MonthlyCalendarGenerator.BuildWeekdayOrder())

        # First row
        row = []

        for item in weekdays:
            if datesEnumerator.current.date.isoweekday() != int(item):
                row.append(CalendarCell.Empty)
            else:
                row.append(datesEnumerator.current)

                if next(datesEnumerator) is None:
                    break
                    
        assert len(row) == len(weekdays)
        yield row
        row = None

        # Middle rows
        while True:
            if datesEnumerator.current.date.isoweekday() == int(weekdays[0]):
                if row is not None:
                    raise RuntimeError()

                row = []

            row.append(datesEnumerator.current)

            if datesEnumerator.current.date.isoweekday() == int(weekdays[-1]):
                assert len(row) == len(weekdays)
                yield row
                row = None

            if next(datesEnumerator) is None:
                break


        # Last row
        if datesEnumerator.current.date.isoweekday() != int(weekdays[-1]):
            previousDaysWritten = False

            for item in weekdays:
                if previousDaysWritten:
                    row.append(CalendarCell.Empty)
                else:
                    previousDaysWritten = (datesEnumerator.current.date.isoweekday() == int(item))

            assert len(row) == len(weekdays)
            yield row
