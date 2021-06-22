using CalendarPrinter.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace CalendarPrinter.Logic
{
    internal abstract class CalendarGenerator : ICalendarGenerator
    {
        public void Create(DateRange range, EventCalendar eventCalendar, TagsToIconConverter tagsToIcon, string outputPath)
        {
            var currentMonth = range.Start;
            while (currentMonth <= range.End)
            {
                Create(currentMonth.Year, currentMonth.Month, eventCalendar, tagsToIcon, outputPath);

                currentMonth = currentMonth.NextMonth();
            }
        }

        private void Create(int year, int month, EventCalendar eventCalendar, TagsToIconConverter tagsToIcon, string outputPath)
        {
            var filename = Path.Combine(outputPath, CreateFilename(year, month));
            using (var writer = new StreamWriter(filename))
            {
                var dates = BuildMonthDates(year, month);
                Create(new DateTime(year, month, 1), dates, eventCalendar, tagsToIcon, writer);
            }
        }

        protected abstract void Create(DateTime month, IEnumerable<DateTime> dates, EventCalendar eventCalendar, TagsToIconConverter tagsToIcon, StreamWriter writer);

        protected abstract string CreateFilename(int year, int month);

        private IEnumerable<DateTime> BuildMonthDates(int year, int month)
        {
            var current = new DateTime(year, month, 1);

            while (current.Month == month)
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

            while(true)
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
    }
}