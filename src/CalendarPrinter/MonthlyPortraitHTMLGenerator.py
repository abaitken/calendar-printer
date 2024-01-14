from datetime import date
from io import TextIOWrapper

from .Configuration import Configuration
from .TagsToIconConverter import TagsToIconConverter
from .YearMonth import YearMonth
from .EventCalendar import EventCalendar
from .MonthlyCalendarGenerator import MonthlyCalendarGenerator, CalendarCell
from .ResourceLoader import ResourceLoader

class MonthlyPortraitHTMLGenerator(MonthlyCalendarGenerator):
    def __init__(self):
        pass


    def CreateFilename(self, year: int) -> str:
        return f'{year}.html'

    def CreateFilename(self, month: YearMonth) -> str:
        return f'{month.Year}-{month.month:02d}.html'

    def WriteFooter(self, writer: TextIOWrapper):
        writer.write('''</body>
</html>''')

    def WriteHeader(self, writer: TextIOWrapper):
        style = self.LoadStyle()
        writer.write(f'''<html>
<head>
<title>Calendar</title>
</head>
<style>
{style}
</style>
<body>''')
        iconDefs = self.LoadIconDefs()
        writer.write(iconDefs)

    def PageBreak(self, writer: TextIOWrapper):
        writer.write('<div class="page-break"></div>')

    def WriteMonth(self, month: YearMonth, dates: list[date], eventCalendar: EventCalendar, tagsToIcon: TagsToIconConverter, configuration: Configuration, writer: TextIOWrapper):
        title = date(month.year, month.month, 1).strftime("%B %Y")

        writer.write(f'<h1>{title}</h1>')

        nextMonth = month.NextMonth()
        nextMonthsImportantEvents = self.FilterImportant(eventCalendar.FindAll(nextMonth), configuration.ImportantTags)
        writer.write('<div class="nextMonthsEvents">')

        writer.write('Next month: ')
        for item in nextMonthsImportantEvents:
            mapping = tagsToIcon.GetIcon(item.Tags)
            icon = "calendar" if mapping is None else mapping.Icon
            color = "grey" if mapping is None else mapping.Color
            iconMarkup = f'''<svg class="upcomingEventIcon" version="2.0">
<use href="#{icon}" />
</svg>'''

            writer.write(f'<div style="color: {color}">{iconMarkup}</div>')
            
        writer.write('</div>')

        writer.write('<div class="divTable">')


        writer.write('<div class="divTableBody">')


        rows = list(self.CalculateCalendarRows(dates, eventCalendar))

        for row in rows:
            writer.write('<div class="divTableRow">')

            for cell in row:
                if cell != CalendarCell.Empty:
                    cellContent = self.BuildCellContent(cell, tagsToIcon)
                    writer.write(f'<div class="divTableCell">{cellContent}</div>')
                else:
                    writer.write('<div class="divTableCell empty"></div>')

            writer.write("</div>")

        writer.write('</div>')

        writer.write("</div>")

    def CalculateCalendarRows(self, dates: list[date], eventCalendar: EventCalendar):
        cells = list(self.CreateCells(dates, eventCalendar))

        take = (len(cells) + 1) / 2
        column0 = list(cells.Take(take))
        column1 = list(cells.Skip(len(column0)))

        if len(column0) != len(column1):
            column1.append(CalendarCell.Empty)

        for i in range(len(column0)):
            cell0 = column0[i]
            cell1 = column1[i]

            yield ( cell0, cell1 )

    def LoadIconDefs(self) -> str:
        result = ResourceLoader().ReadFile("SVGIcons.xml")

        return f'''<svg style="display: none" version="2.0">
{result}
</svg>'''

    def LoadStyle(self) -> str:
        result = ResourceLoader().ReadFile("PortraitStylesheet.css")
        return result
        
    def BuildCellContent(self, cell: CalendarCell, tagsToIcon: TagsToIconConverter) -> str:
        date = cell.date
        builder = ''
        builder += '<div class="dayNumber">{date.day:02d}, {date.DayOfWeek}</div>'

        events = cell.Events
        for item in events:
            mapping = tagsToIcon.GetIcon(item.Tags)
            icon = "calendar" if mapping is None else mapping.Icon
            color = "grey" if mapping is None else mapping.Color
            iconMarkup = f'''<svg class="icon" version="2.0">
<use href="#{icon}" />
</svg>'''

            builder += f'<div class="eventText" style="color: {color}">{iconMarkup}{item.Text}</div>'

        return builder