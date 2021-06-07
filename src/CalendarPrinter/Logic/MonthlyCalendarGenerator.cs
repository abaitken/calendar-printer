using CalendarPrinter.Model;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;

namespace CalendarPrinter.Logic
{
    internal abstract class MonthlyCalendarGenerator : ICalendarGenerator
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

        protected IEnumerable<DayOfWeek> BuildWeekdayOrder()
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


        protected class CalendarCell
        {
            public static readonly CalendarCell Empty = new CalendarCell();

            public DateTime? Date { get; internal set; }
            public List<CalendarEvent> Events { get; internal set; }
        }

        protected IEnumerable<List<CalendarCell>> CalculateCalendarRows(IEnumerable<DateTime> dates, EventCalendar eventCalendar)
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
    }
}