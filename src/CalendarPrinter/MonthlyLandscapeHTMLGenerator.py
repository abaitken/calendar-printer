from datetime import date
from io import TextIOWrapper
from .CalendarGenerator import CalendarCell
from .Configuration import Configuration
from .TagsToIconConverter import TagsToIconConverter
from .YearMonth import YearMonth
from .EventCalendar import EventCalendar
from .MonthlyCalendarGenerator import MonthlyCalendarGenerator
from .ResourceLoader import ResourceLoader

class MonthlyLandscapeHTMLGenerator(MonthlyCalendarGenerator):
    def __init__(self):
        pass

    def CreateFilename(self, year: int) -> str:
        return f'{year}.html'

    def CreateMonthFilename(self, month: YearMonth) -> str:
        return f'{month.year}-{month.month:02d}.html'

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
        nextMonthsImportantEvents = self.FilterImportant(eventCalendar.FindAll(nextMonth), configuration.important_tags)
        writer.write('<div class="nextMonthsEvents">')

        writer.write('Next month: ')
        for item in nextMonthsImportantEvents:
            mapping = tagsToIcon.GetIcon(item.tags)
            icon = "calendar" if mapping is None else mapping.icon
            color = "grey" if mapping is None else mapping.color
            iconMarkup = f'''<svg class="upcomingEventIcon" version="2.0">
<use href="#{icon}" />
</svg>'''

            writer.write(f'<div style="color: {color}">{iconMarkup}</div>')
        
        writer.write('</div>')

        writer.write('<div class="divTable">')

        # Week day names
        writer.write('<div class="divTableHeading">')

        weekdays = list(MonthlyCalendarGenerator.BuildWeekdayOrder())

        writer.write('<div class="divTableRow">')
        for item in weekdays:
            writer.write(f'<div class="divTableHead">{item.to_str()}</div>')
            
        writer.write('</div>')

        writer.write('</div>')
        writer.write('<div class="divTableBody">')


        rows = list(self.CalculateCalendarRows(dates, eventCalendar))
        rowHeight = f'row{len(rows)}Height'

        for row in rows:
            writer.write('<div class="divTableRow">')

            for cell in row:
                if cell.date is not None:
                    cellContent = self.BuildCellContent(cell, tagsToIcon)
                    writer.write(f'<div class="divTableCell {rowHeight}">{cellContent}</div>')
                else:
                    writer.write(f'<div class="divTableCell {rowHeight} empty"></div>')

            writer.write("</div>")

        writer.write('</div>')

        writer.write("</div>")

    def LoadIconDefs(self) -> str:
        result = ResourceLoader().ReadFile("SVGIcons.xml")

        return f'''<svg style="display: none" version="2.0">
{result}
</svg>'''

    def LoadStyle(self) -> str:
        result = ResourceLoader().ReadFile("LandscapeStylesheet.css")
        return result

    def BuildCellContent(self, cell: CalendarCell, tagsToIcon: TagsToIconConverter) -> str:
        date = cell.date
        builder = ''
        builder += f'<div class="dayNumber">{date.day:02d}</div>'

        events = cell.events
        for item in events:
            mapping = tagsToIcon.GetIcon(item.tags)
            icon = "calendar" if mapping is None else mapping.icon
            color = "grey" if mapping is None else mapping.color
            
            iconMarkup = ''
            if icon is not None and len(icon) != 0:
                iconMarkup = f'''<svg class="icon" version="2.0"><use href="#{icon}" /></svg>'''
            
            builder += f'<div class="eventText" style="color: {color}">{iconMarkup}{item.text}</div>'

        return builder
        