using CalendarPrinter.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace CalendarPrinter.Logic
{
    internal abstract class CalendarGenerator : ICalendarGenerator
    {
        public void Create(DateRange range, EventCalendar eventCalendar, TagsToIconConverter tagsToIcon, Configuration configuration, string outputPath)
        {
            var filename = Path.Combine(outputPath, CreateFilename(range.Start.Year));
            using (var writer = new StreamWriter(filename))
            {
                WriteHeader(writer);

                var currentMonth = range.Start;
                var pageBreak = false;

                while (currentMonth <= range.End)
                {
                    if (pageBreak)
                        PageBreak(writer);
                    Create(currentMonth.ToYearMonth(), eventCalendar, tagsToIcon, configuration, outputPath);

                    var dates = BuildMonthDates(currentMonth.ToYearMonth());
                    WriteMonth(currentMonth.ToYearMonth(), dates, eventCalendar, tagsToIcon, configuration, writer);
                    pageBreak = true;
                    currentMonth = currentMonth.NextMonth();
                }

                PageBreak(writer);
                WriteFooter(writer);
            }
        }

        protected abstract void PageBreak(StreamWriter writer);

        private void Create(YearMonth month, EventCalendar eventCalendar, TagsToIconConverter tagsToIcon, Configuration configuration, string outputPath)
        {
            var filename = Path.Combine(outputPath, CreateFilename(month));
            using (var writer = new StreamWriter(filename))
            {
                var dates = BuildMonthDates(month);
                WriteHeader(writer);
                WriteMonth(month, dates, eventCalendar, tagsToIcon, configuration, writer);
                WriteFooter(writer);
            }
        }

        protected abstract void WriteFooter(StreamWriter writer);
        protected abstract void WriteHeader(StreamWriter writer);
        protected abstract void WriteMonth(YearMonth month, IEnumerable<DateTime> dates, EventCalendar eventCalendar, TagsToIconConverter tagsToIcon, Configuration configuration, StreamWriter writer);

        protected abstract string CreateFilename(int year);
        protected abstract string CreateFilename(YearMonth month);

        private IEnumerable<DateTime> BuildMonthDates(YearMonth month)
        {
            var current = month.ToFirstDay();

            while (current.Month == month.Month)
            {
                yield return current;
                current = current.AddDays(1);
            }
        }


        protected class CalendarCell
        {
            public static readonly CalendarCell Empty = new CalendarCell();

            public DateTime? Date { get; internal set; }
            public List<CalendarEvent> Events { get; internal set; }
        }

        protected IEnumerable<CalendarCell> CreateCells(IEnumerable<DateTime> dates, EventCalendar eventCalendar)
        {
            var datesEnumerator = dates.GetEnumerator();
            if (!datesEnumerator.MoveNext())
                throw new InvalidOperationException();

            while (true)
            {
                yield return new CalendarCell
                {
                    Date = datesEnumerator.Current,
                    Events = eventCalendar.FindAll(datesEnumerator.Current).ToList()
                };

                if (!datesEnumerator.MoveNext())
                    break;
            }
        }

        protected IEnumerable<Model.CalendarEvent> FilterImportant(IEnumerable<Model.CalendarEvent> events, IEnumerable<string> importantTags)
        {
            foreach (var item in events)
            {
                if (importantTags.Contains("*") || item.Tags.Contains("important") || item.Tags.Any(tag => importantTags.Contains(tag)))
                    yield return item;
            }
        }
    }
}