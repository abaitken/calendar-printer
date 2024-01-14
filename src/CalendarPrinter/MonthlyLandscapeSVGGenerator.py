from datetime import date
from io import TextIOWrapper
from .Configuration import Configuration
from .TagsToIconConverter import TagsToIconConverter
from .YearMonth import YearMonth
from .EventCalendar import EventCalendar
from .MonthlyCalendarGenerator import MonthlyCalendarGenerator
from enum import Enum
from .Color import Color
import re

class SVGFontWeight(Enum):
    Normal = 1
    Bold = 2

class SVGFont:
    def __init__(self, size: float, weight: SVGFontWeight):
        self.size = size
        self.weight = weight

class SVGFontSize:
    def Parse(value: str) -> 'SVGFontSize':
        px = re.search('(?<VALUE>\d+\.?\d*)\s*px', value)
        if px.Success:
            return SVGFontSize(float(px.groups('VALUE')))

        raise RuntimeError()
    
    def __init__(self, size: float):
        self.heightpx = size


class SVGDrawingContext:
    def __init__(self, stream: TextIOWrapper):
        self._stream = stream
    
    def DisplayText(self, x, y, font, color, text):
        actualY = y + font.Size.HeightPx
        actualX = x
        weight = '' if font.Weight == SVGFontWeight.Normal else f' font-weight="{font.Weight.lower()}"'
        self.WriteLine(f'''<text x="{actualX}" y="{actualY}" font-size="{font.Size}"{weight} fill="{color.Name}">
{text}
</text>''')
    def Rect(self, x: float, y: float, width: float, height: float, fill: Color):
        self.WriteLine(f'<rect x="{x}" y="{y}" width="{width}" height="{height}" fill="{fill.Name}"/>')

    # def Rect(self, point, size, fill):
    #     self.Rect(point.X, point.Y, size.Width, size.Height, fill)

    def Line(self, x1: float, y1: float, x2: float, y2: float, stroke: Color):
        self.WriteLine(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke.Name}" />')

    # def Line(self, from_, to, stroke: Color):
    #     self.Line(from_.X, from_.Y, to.X, to.Y, stroke)

    def WriteLine(self, text: str):
        self._stream.write(text)
        self._stream.write('\n')
        
class MonthlyLandscapeSVGGenerator(MonthlyCalendarGenerator):
    def __init__(self):
        pass

    def WriteFooter(self, writer: TextIOWrapper):
        writer.write('</svg>')

    def WriteHeader(self, writer: TextIOWrapper):
        writer.write(f'''<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>Calendar</title>''')

    def PageBreak(self, writer: TextIOWrapper):
        pass

    def WriteMonth(self, month: YearMonth, dates: list[date], eventCalendar: EventCalendar, tagsToIcon: TagsToIconConverter, configuration: Configuration, writer: TextIOWrapper):
        title = date(month.year, month.month, 1).strftime("%B %Y")

        g = SVGDrawingContext(writer)

        titleFont = SVGFont(size = SVGFontSize.Parse("24px"),
            weight = SVGFontWeight.Bold)

        weekDayFont = SVGFont(size = SVGFontSize.Parse("12px"),
            weight = SVGFontWeight.Normal)

        cellDayFont = SVGFont(size = SVGFontSize.Parse("12px"),
            weight = SVGFontWeight.Normal)

        cellEventFont = SVGFont(size = SVGFontSize.Parse("10px"),
            weight = SVGFontWeight.Normal)

        leftMargin = 5
        topMargin = 5
        cellWidth = 100
        cellHeight = 100
        lineThickness = 2

        lineColor = Color.Black

        x = 0.0
        y = 0.0

        x = leftMargin
        y = topMargin
        g.DisplayText(leftMargin, y, titleFont, Color.Crimson, title)

        y += titleFont.Size.HeightPx
        
        weekdays = list(self.BuildWeekdayOrder())
        rows = list(self.CalculateCalendarRows(dates, eventCalendar))

        tableWidth = (len(weekdays) * (cellWidth + lineThickness)) + lineThickness
        tableHeight = lineThickness + weekDayFont.Size.HeightPx + lineThickness + (len(rows) * (cellHeight + lineThickness))
        
        g.Line(x, y, tableWidth, y, lineColor)
        y += lineThickness

        # Week day headers
        for item in weekdays:
            g.DisplayText(x, y, weekDayFont, Color.Black, item.ToString())
            g.Line(x, y, x, tableHeight, lineColor)
            x += cellWidth

        y += weekDayFont.Size.HeightPx

        # Rows
        for row in rows:
            x = leftMargin
            g.Line(x, y, tableWidth, y, lineColor)
            y += lineThickness

            for cell in row:
                if cell.date is not None:
                    cellY = y
                    g.DisplayText(x, cellY, cellDayFont, Color.Black, cell.Date.Value.Day.ToString("D2"))

                    cellY += cellDayFont.Size.HeightPx

                    for item in cell.events:
                        g.DisplayText(x, cellY, cellEventFont, Color.Black, item.Text)
                        cellY += cellEventFont.Size.HeightPx
                else:
                    g.Rect(x, y, cellWidth, cellHeight, Color.Gray)
                x += cellWidth

            y += cellHeight

        x = leftMargin
        g.Line(x, y, tableWidth, y, lineColor)
        y += lineThickness

    def CreateFilename(self, month: YearMonth) -> str:
        return f'{month.year}-{month.month:02d}.svg'
        
    def CreateFilename(self, year: int) -> str:
        return f'{year}.svg'