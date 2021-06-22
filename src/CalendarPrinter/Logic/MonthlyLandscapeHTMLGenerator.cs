using CalendarPrinter.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace CalendarPrinter.Logic
{
    internal class MonthlyLandscapeHTMLGenerator : MonthlyCalendarGenerator
    {
        protected override string CreateFilename(int year, int month)
        {
            return $"{year}-{month:D2}.html";
        }

        protected override void Create(DateTime month, IEnumerable<DateTime> dates, EventCalendar eventCalendar, TagsToIconConverter tagsToIcon, StreamWriter writer)
        {
            var title = month.ToString("MMMM yyyy");

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

            writer.WriteLine(@"<div class=""divTable"">");

            // Week day names
            writer.WriteLine(@"<div class=""divTableHeading"">");

            var weekdays = BuildWeekdayOrder().ToArray();

            writer.WriteLine(@"<div class=""divTableRow"">");
            foreach (var item in weekdays)
            {
                writer.Write($@"<div class=""divTableHead"">{item}</div>");
            }
            writer.WriteLine("</div>");

            writer.WriteLine(@"</div>");
            writer.WriteLine(@"<div class=""divTableBody"">");



            var rows = CalculateCalendarRows(dates, eventCalendar).ToList();

            foreach (var row in rows)
            {

                writer.WriteLine(@"<div class=""divTableRow"">");

                foreach (var cell in row)
                {
                    if (cell.Date.HasValue)
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

        private string LoadIconDefs()
        {
            var result = new ResourceLoader().ReadFile("/Logic/SVGIcons.xml");

            return $@"<svg style=""display: none"" version=""2.0"">
{result}
</svg>";
        }

        private string LoadStyle()
        {
            var result = new ResourceLoader().ReadFile("/Logic/LandscapeStylesheet.css");
            return result;
        }

        private string BuildCellContent(CalendarCell cell, TagsToIconConverter tagsToIcon)
        {
            var date = cell.Date.Value;
            var builder = new StringBuilder();
            builder.AppendLine($@"<div class=""dayNumber"">{date.Day:D2}</div>");

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