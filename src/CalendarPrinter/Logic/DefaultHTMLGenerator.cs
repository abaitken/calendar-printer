﻿using CalendarPrinter.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace CalendarPrinter.Logic
{
    internal class DefaultHTMLGenerator : MonthlyCalendarGenerator
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

            writer.WriteLine(@"<table>");

            // Week day names
            writer.WriteLine(@"<thead>");

            var weekdays = BuildWeekdayOrder().ToArray();

            writer.WriteLine(@"<tr class=""weekday row"">");
            foreach (var item in weekdays)
            {
                writer.Write($@"<th class=""weekday cell"">{item}</th>");
            }
            writer.WriteLine("</tr>");

            writer.WriteLine(@"</thead>");
            writer.WriteLine(@"<tbody>");



            var rows = CalculateCalendarRows(dates, eventCalendar).ToList();

            foreach (var row in rows)
            {

                writer.WriteLine(@"<tr class=""day row"">");

                foreach (var cell in row)
                {
                    if (cell.Date.HasValue)
                    {
                        writer.WriteLine($@"<td class=""day cell"">{BuildCellContent(cell, tagsToIcon)}</td>");

                    }
                    else
                        writer.WriteLine($@"<td class=""empty cell""></td>");
                }

                writer.WriteLine("</tr>");
            }

            writer.WriteLine(@"</tbody>");

            writer.WriteLine("</table>");

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
            var result = new ResourceLoader().ReadFile("/Logic/Stylesheet.css");
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
                var icon = tagsToIcon.GetIcon(item.Tags);
                if (icon == null)
                    icon = "calendar";
                var iconMarkup = $@"<svg class=""icon"" version=""2.0"">
<use href=""#{icon}"" />
</svg>";
                builder.AppendLine($@"<div class=""eventText"">{iconMarkup}{item.Text}</div>");
            }

            return builder.ToString();
        }
    }
}