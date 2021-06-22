using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace CalendarPrinter.Logic
{
    internal class MonthlyPortraitHTMLGenerator : CalendarGenerator
    {
        protected override string CreateFilename(Model.YearMonth month)
        {
            return $"{month.Year}-{month.Month:D2}.html";
        }

        protected override void Create(Model.YearMonth month, IEnumerable<DateTime> dates, EventCalendar eventCalendar, TagsToIconConverter tagsToIcon, Model.Configuration configuration, StreamWriter writer)
        {
            var title = month.ToFirstDay().ToString("MMMM yyyy");

            var style = LoadStyle();
            writer.WriteLine($@"<html>
<head>
<title>{title}</title>
</head>
<style>
{style}
</style>
<body>");
            var iconDefs = LoadIconDefs();
            writer.WriteLine(iconDefs);

            writer.WriteLine($@"<h1>{title}</h1>");

            var nextMonth = month.AddMonths(1);
            var nextMonthsImportantEvents = FilterImportant(eventCalendar.FindAll(nextMonth), configuration.ImportantTags);
            writer.WriteLine(@"<div class=""nextMonthsEvents"">");

            writer.WriteLine(@"Next month: ");
            foreach (var item in nextMonthsImportantEvents)
            {
                var mapping = tagsToIcon.GetIcon(item.Tags);
                var icon = mapping == null ? "calendar" : mapping.Icon;
                var color = mapping == null ? "grey" : mapping.Color;
                var iconMarkup = $@"<svg class=""upcomingEventIcon"" version=""2.0"">
<use href=""#{icon}"" />
</svg>";

                writer.WriteLine($@"<div style=""color: {color}"">{iconMarkup}</div>");
            }
            writer.WriteLine(@"</div>");

            writer.WriteLine(@"<div class=""divTable"">");


            writer.WriteLine(@"<div class=""divTableBody"">");


            var rows = CalculateCalendarRows(dates, eventCalendar).ToList();

            foreach (var row in rows)
            {

                writer.WriteLine(@"<div class=""divTableRow"">");

                foreach (var cell in row)
                {
                    if (cell != CalendarCell.Empty)
                    {
                        writer.WriteLine($@"<div class=""divTableCell"">{BuildCellContent(cell, tagsToIcon)}</div>");

                    }
                    else
                        writer.WriteLine($@"<div class=""divTableCell empty""></div>");
                }

                writer.WriteLine("</div>");
            }

            writer.WriteLine(@"</div>");

            writer.WriteLine("</div>");

            writer.WriteLine(@"</body>
</html>");
        }

        private IEnumerable<IEnumerable<CalendarCell>> CalculateCalendarRows(IEnumerable<DateTime> dates, EventCalendar eventCalendar)
        {
            var cells = CreateCells(dates, eventCalendar).ToList();

            var take = (cells.Count + 1) / 2;
            var column0 = cells.Take(take).ToList();
            var column1 = cells.Skip(column0.Count).ToList();

            if (column0.Count != column1.Count)
                column1.Add(CalendarCell.Empty);

            for (int i = 0; i < column0.Count; i++)
            {
                var cell0 = column0[i];
                var cell1 = column1[i];

                yield return new[] { cell0, cell1 };
            }
        }

        private string LoadIconDefs()
        {
            var result = new ResourceLoader().ReadFile("/Logic/SVGIcons.xml");

            return $@"<svg style=""display: none"" version=""2.0"">
{result}
</svg>";
        }

        private string LoadStyle()
        {
            var result = new ResourceLoader().ReadFile("/Logic/PortraitStylesheet.css");
            return result;
        }

        private string BuildCellContent(CalendarCell cell, TagsToIconConverter tagsToIcon)
        {
            var date = cell.Date.Value;
            var builder = new StringBuilder();
            builder.AppendLine($@"<div class=""dayNumber"">{date.Day:D2}, {date.DayOfWeek}</div>");

            var events = cell.Events;
            foreach (var item in events)
            {
                var mapping = tagsToIcon.GetIcon(item.Tags);
                var icon = mapping == null ? "calendar" : mapping.Icon;
                var color = mapping == null ? "grey" : mapping.Color;
                var iconMarkup = $@"<svg class=""icon"" version=""2.0"">
<use href=""#{icon}"" />
</svg>";

                builder.AppendLine($@"<div class=""eventText"" style=""color: {color}"">{iconMarkup}{item.Text}</div>");
            }

            return builder.ToString();
        }
    }
}