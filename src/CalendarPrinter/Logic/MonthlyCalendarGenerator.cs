using CalendarPrinter.Model;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace CalendarPrinter.Logic
{
    internal abstract class MonthlyCalendarGenerator : CalendarGenerator
    {

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

        protected IEnumerable<List<CalendarCell>> CalculateCalendarRows(IEnumerable<DateTime> dates, EventCalendar eventCalendar)
        {
            var datesEnumerator = CreateCells(dates, eventCalendar).GetEnumerator();
            if (!datesEnumerator.MoveNext())
                throw new InvalidOperationException();

            var weekdays = BuildWeekdayOrder().ToArray();

            // First row
            var row = new List<CalendarCell>(weekdays.Length);

            foreach (var item in weekdays)
            {
                if (datesEnumerator.Current.Date.Value.DayOfWeek != item)
                    row.Add(CalendarCell.Empty);
                else
                {
                    row.Add(datesEnumerator.Current);

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
                if (datesEnumerator.Current.Date.Value.DayOfWeek == weekdays.First())
                {
                    if (row != null)
                        throw new InvalidOperationException();

                    row = new List<CalendarCell>(weekdays.Length);
                }

                row.Add(datesEnumerator.Current);

                if (datesEnumerator.Current.Date.Value.DayOfWeek == weekdays.Last())
                {
                    Debug.Assert(row.Count == weekdays.Length);
                    yield return row;
                    row = null;
                }

                if (!datesEnumerator.MoveNext())
                    break;
            }


            // Last row
            if (datesEnumerator.Current.Date.Value.DayOfWeek != weekdays.Last())
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
                        previousDaysWritten = datesEnumerator.Current.Date.Value.DayOfWeek == item;
                    }
                }

                Debug.Assert(row.Count == weekdays.Length);
                yield return row;
            }

        }
    }
}