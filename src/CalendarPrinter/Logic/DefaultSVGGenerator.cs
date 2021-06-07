using CalendarPrinter.Model;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace CalendarPrinter.Logic
{
    internal class DefaultSVGGenerator : ICalendarGenerator
    {
        public void Create(DateRange range, EventCalendar eventCalendar, string outputPath)
        {
            var currentMonth = range.Start;
            while (currentMonth <= range.End)
            {
                Create(currentMonth.Year, currentMonth.Month, eventCalendar, outputPath);

                currentMonth = currentMonth.NextMonth();
            }
        }

        private void Create(int year, int month, EventCalendar eventCalendar, string outputPath)
        {
            var filename = Path.Combine(outputPath, $"{year}-{month:D2}.svg");
            using (var writer = new StreamWriter(filename))
            {
                var dates = BuildMonthDates(year, month);
                Create(new DateTime(year, month, 1), dates, eventCalendar, writer);
            }
        }

        enum SVGFontWeight
        {
            Normal,
            Bold
        }

        class SVGFont
        {
            public SVGFontSize Size { get; set; }
            public SVGFontWeight Weight { get; set; }
        }

        class SVGFontSize
        {
            private static readonly Regex pxParse = new Regex(@"(?<VALUE>\d+\.?\d*)\s*px", RegexOptions.Compiled);
            private double _size;

            public SVGFontSize(double size)
            {
                _size = size;
            }

            public double HeightPx => _size;

            public static SVGFontSize Parse(string value)
            {
                var px = pxParse.Match(value);
                if (px.Success)
                    return new SVGFontSize(double.Parse(px.Groups["VALUE"].Value));

                throw new InvalidOperationException();
            }

            public override string ToString()
            {
                return $"{HeightPx}px";
            }
        }

        class SVGDrawingContext
        {
            private readonly StreamWriter _stream;

            public SVGDrawingContext(StreamWriter stream)
            {
                _stream = stream;
            }

            public void DisplayText(double x, double y, SVGFont font, Color color, string text)
            {
                var actualY = y + font.Size.HeightPx;
                var actualX = x;
                var weight = font.Weight == SVGFontWeight.Normal ? string.Empty : $@" font-weight=""{font.Weight.ToString().ToLower()}""";
                WriteLine($@"<text x=""{actualX}"" y=""{actualY}"" font-size=""{font.Size}""{weight} fill=""{color.Name}"">
{text}
</text>");

            }

            public void Rect(double x, double y, double width, double height, Color fill)
            {
                WriteLine($@"<rect x=""{x}"" y=""{y}"" width=""{width}"" height=""{height}"" fill=""{fill.Name}""/>");
            }

            public void Line(double x1, double y1, double x2, double y2, Color stroke)
            {
                WriteLine($@"<line x1=""{x1}"" y1=""{y1}"" x2=""{x2}"" y2=""{y2}"" stroke=""{stroke.Name}"" />");
            }

            public void Line(PointF from, PointF to, Color stroke)
            {
                Line(from.X, from.Y, to.X, to.Y, stroke);
            }

            public void Rect(PointF point, Size size, Color fill)
            {
                Rect(point.X, point.Y, size.Width, size.Height, fill);
            }

            private void WriteLine(string text)
            {
                _stream.WriteLine(text);
            }
        }

        class CalendarCell
        {
            public static readonly CalendarCell Empty = new CalendarCell();

            public DateTime? Date { get; internal set; }
            public List<CalendarEvent> Events { get; internal set; }
        }

        private IEnumerable<List<CalendarCell>> CalculateCalendarRows(IEnumerable<DateTime> dates, EventCalendar eventCalendar)
        {
            var datesEnumerator = dates.GetEnumerator();
            if (!datesEnumerator.MoveNext())
                throw new InvalidOperationException();

            var weekdays = BuildWeekdayOrder().ToArray();

            // First row
            var row = new List<CalendarCell>(weekdays.Length);

            foreach (var item in weekdays)
            {
                if (datesEnumerator.Current.DayOfWeek != item)
                    row.Add(CalendarCell.Empty);
                else
                {
                    row.Add(new CalendarCell
                    {
                        Date = datesEnumerator.Current,
                        Events = eventCalendar.FindAll(datesEnumerator.Current).ToList()
                    });

                    if (!datesEnumerator.MoveNext())
                        break;
                }
            }

            Debug.Assert(row.Count == weekdays.Length);
            yield return row;
            row = null;

            // Middle rows
            while (true)
            {
                if (datesEnumerator.Current.DayOfWeek == weekdays.First())
                {
                    if (row != null)
                        throw new InvalidOperationException();

                    row = new List<CalendarCell>(weekdays.Length);
                }

                row.Add(new CalendarCell
                {
                    Date = datesEnumerator.Current,
                    Events = eventCalendar.FindAll(datesEnumerator.Current).ToList()
                });

                if (datesEnumerator.Current.DayOfWeek == weekdays.Last())
                {
                    Debug.Assert(row.Count == weekdays.Length);
                    yield return row;
                    row = null;
                }

                if (!datesEnumerator.MoveNext())
                    break;
            }


            // Last row
            if (datesEnumerator.Current.DayOfWeek != weekdays.Last())
            {
                bool previousDaysWritten = false;

                foreach (var item in weekdays)
                {
                    if (previousDaysWritten)
                    {
                        row.Add(CalendarCell.Empty);
                    }
                    else
                    {
                        previousDaysWritten = datesEnumerator.Current.DayOfWeek == item;
                    }
                }

                Debug.Assert(row.Count == weekdays.Length);
                yield return row;
            }

        }



        private void Create(DateTime month, IEnumerable<DateTime> dates, EventCalendar eventCalendar, StreamWriter writer)
        {
            var title = month.ToString("MMMM yyyy");

            writer.WriteLine($@"<?xml version=""1.0"" standalone=""no""?>
<!DOCTYPE svg PUBLIC ""-//W3C//DTD SVG 1.1//EN"" ""http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"">
<svg width=""100%"" height=""100%"" xmlns=""http://www.w3.org/2000/svg"" xmlns:xlink=""http://www.w3.org/1999/xlink"">
<title>{title}</title>");

            var g = new SVGDrawingContext(writer);


            var titleFont = new SVGFont
            {
                Size = SVGFontSize.Parse("24px"),
                Weight = SVGFontWeight.Bold
            };

            var weekDayFont = new SVGFont
            {
                Size = SVGFontSize.Parse("12px"),
                Weight = SVGFontWeight.Normal
            };

            var cellDayFont = new SVGFont
            {
                Size = SVGFontSize.Parse("12px"),
                Weight = SVGFontWeight.Normal
            };

            var cellEventFont = new SVGFont
            {
                Size = SVGFontSize.Parse("10px"),
                Weight = SVGFontWeight.Normal
            };

            const int leftMargin = 5;
            const int topMargin = 5;
            const int cellWidth = 100;
            const int cellHeight = 100;
            const int lineThickness = 2;

            var lineColor = Color.Black;

            double x = 0.0;
            double y = 0.0;

            x = leftMargin;
            y = topMargin;
            g.DisplayText(leftMargin, y, titleFont, Color.Crimson, title);

            y += titleFont.Size.HeightPx;
            
            var weekdays = BuildWeekdayOrder().ToList();
            var rows = CalculateCalendarRows(dates, eventCalendar).ToList();

            var tableWidth = (weekdays.Count * (cellWidth + lineThickness)) + lineThickness;
            var tableHeight = lineThickness + weekDayFont.Size.HeightPx + lineThickness + (rows.Count * (cellHeight + lineThickness));
            
            g.Line(x, y, tableWidth, y, lineColor);
            y += lineThickness;

            // Week day headers
            foreach (var item in weekdays)
            {
                g.DisplayText(x, y, weekDayFont, Color.Black, item.ToString());
                g.Line(x, y, x, tableHeight, lineColor);
                x += cellWidth;
            }

            y += weekDayFont.Size.HeightPx;

            // Rows
            foreach (var row in rows)
            {
                x = leftMargin;
                g.Line(x, y, tableWidth, y, lineColor);
                y += lineThickness;

                foreach (var cell in row)
                {
                    if (cell.Date.HasValue)
                    {
                        var cellY = y;
                        g.DisplayText(x, cellY, cellDayFont, Color.Black, cell.Date.Value.Day.ToString());

                        cellY += cellDayFont.Size.HeightPx;


                        foreach (var item in cell.Events)
                        {
                            g.DisplayText(x, cellY, cellEventFont, Color.Black, item.Text);
                            cellY += cellEventFont.Size.HeightPx;
                        }
                    }
                    else
                    {
                        g.Rect(x, y, cellWidth, cellHeight, Color.Gray);
                    }
                    x += cellWidth;
                }

                y += cellHeight;
            }

            x = leftMargin;
            g.Line(x, y, tableWidth, y, lineColor);
            y += lineThickness;

            writer.WriteLine(@"</svg>");
        }

        private IEnumerable<DayOfWeek> BuildWeekdayOrder()
        {
            yield return DayOfWeek.Monday;
            yield return DayOfWeek.Tuesday;
            yield return DayOfWeek.Wednesday;
            yield return DayOfWeek.Thursday;
            yield return DayOfWeek.Friday;
            yield return DayOfWeek.Saturday;
            yield return DayOfWeek.Sunday;
        }

        private IEnumerable<DateTime> BuildMonthDates(int year, int month)
        {
            var current = new DateTime(year, month, 1);

            while (current.Month == month)
            {
                yield return current;
                current = current.AddDays(1);
            }
        }
    }
}