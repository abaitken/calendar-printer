using CalendarPrinter.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace CalendarPrinter.Logic
{
    internal class DefaultHTMLGenerator : ICalendarGenerator
    {
        public void Create(DateRange range, EventCalendar eventCalendar, string outputPath)
        {
            var currentMonth = range.Start;
            while(currentMonth <= range.End)
            {
                Create(currentMonth.Year, currentMonth.Month, eventCalendar, outputPath);
                
                currentMonth = currentMonth.NextMonth();
            }
        }

        private void Create(int year, int month, EventCalendar eventCalendar, string outputPath)
        {
            var filename = Path.Combine(outputPath, $"{year}-{month:D2}.html");
            using (var writer = new StreamWriter(filename))
            {
                var dates = BuildMonthDates(year, month);
                Create(dates, eventCalendar, writer);
            }
        }

        private void Create(IEnumerable<DateTime> dates, EventCalendar eventCalendar, StreamWriter writer)
        {
            var datesEnumerator = dates.GetEnumerator();
            if (!datesEnumerator.MoveNext())
                throw new InvalidOperationException();

            var title = datesEnumerator.Current.ToString("MMMM yyyy");

            var style = LoadStyle();
            writer.WriteLine($@"<html>
<head>
<title>{title}</title>
</head>
<style>
{style}
</style>
<body>");

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

            // First row
            writer.WriteLine(@"<tr class=""day row"">");

            foreach (var item in weekdays)
            {
                if (datesEnumerator.Current.DayOfWeek != item)
                    writer.WriteLine($@"<td class=""empty cell""></td>");
                else
                {
                    writer.WriteLine($@"<td class=""day cell"">{BuildCellContent(datesEnumerator.Current, eventCalendar)}</td>");

                    if (!datesEnumerator.MoveNext())
                        break;
                }
            }

            writer.WriteLine("</tr>");

            // Middle rows
            while(true)
            {
                if (datesEnumerator.Current.DayOfWeek == weekdays.First())
                    writer.WriteLine(@"<tr class=""day row"">");

                writer.WriteLine($@"<td class=""day cell"">{BuildCellContent(datesEnumerator.Current, eventCalendar)}</td>");

                if(datesEnumerator.Current.DayOfWeek == weekdays.Last())
                    writer.WriteLine("</tr>");

                if (!datesEnumerator.MoveNext())
                    break;
            }

            // Last row
            if (datesEnumerator.Current.DayOfWeek != weekdays.Last())
            {
                bool previousDaysWritten = false;

                foreach (var item in weekdays)
                {
                    if(previousDaysWritten)
                    {
                        writer.WriteLine($@"<td class=""empty cell""></td>");
                    }
                    else
                    {
                        previousDaysWritten = datesEnumerator.Current.DayOfWeek == item;
                    }
                }

                writer.WriteLine("</tr>");
            }

            writer.WriteLine(@"</tbody>");

            writer.WriteLine("</table>");

            writer.WriteLine(@"</body>
</html>");
        }

        private string LoadStyle()
        {
            var result = new ResourceLoader().ReadFile("/Logic/Stylesheet.css");
            return result;
        }

        private string BuildCellContent(DateTime date, EventCalendar events)
        {
            var builder = new StringBuilder();
            builder.AppendLine($"<div>{date.Day}</div>");

            var otherEvents = events.FindAll(date);
            foreach (var item in otherEvents)
            {
                builder.AppendLine($"<div>{item.Text}</div>");
            }

            return builder.ToString();
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

            while(current.Month == month)
            {
                yield return current;
                current = current.AddDays(1);
            }
        }
    }
}