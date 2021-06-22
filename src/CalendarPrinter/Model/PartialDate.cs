using System;
using System.Diagnostics;

namespace CalendarPrinter.Model
{
    [DebuggerDisplay("{Year}-{Month}-{Day}")]
    public class PartialDate
    {
        private PartialDate(int? year, int? month, int? day)
        {
            if (!year.HasValue && !month.HasValue && !day.HasValue)
                throw new ArgumentException("At least one argument must have a value");

            Year = year;
            Month = month;
            Day = day;
        }

        private int? Year { get; }
        private int? Month { get; }
        private int? Day { get; }

        public bool Intersects(DateTime date)
        {
            if (Year.HasValue && Year.Value != date.Year)
                return false;

            if (Month.HasValue && Month.Value != date.Month)
                return false;

            if (Day.HasValue && Day.Value != date.Day)
                return false;

            return true;
        }

        public bool Intersects(YearMonth month)
        {
            if (Year.HasValue && Year.Value != month.Year)
                return false;

            if (Month.HasValue && Month.Value != month.Month)
                return false;

            return true;
        }


        public static PartialDate Parse(string s)
        {
            var parts = s.Split('-');

            if (parts.Length > 3)
                throw new ArgumentException("Input string contains more than 3 parts");

            var year = ParseYear(parts[0]);
            var month = parts.Length > 1 ? ParseMonth(parts[1]) : null;
            var day = parts.Length > 2 ? ParseDay(parts[2]) : null;
            return new PartialDate(year, month, day);
        }

        private static int? ParseDay(string s)
        {
            if (s.Length != 2)
                throw new ArgumentException("Expected 2 characters denoting the day");

            if (s.Equals("##"))
                return null;

            if (int.TryParse(s, out var result))
                return result;

            throw new ArgumentException("Unable to parse day");
        }

        private static int? ParseMonth(string s)
        {
            if (s.Length != 2)
                throw new ArgumentException("Expected 2 characters denoting the month");

            if (s.Equals("##"))
                return null;

            if (int.TryParse(s, out var result))
                return result;

            throw new ArgumentException("Unable to parse month");
        }

        private static int? ParseYear(string s)
        {
            if (s.Length != 4)
                throw new ArgumentException("Expected 4 characters denoting the year");

            if (s.Equals("####"))
                return null;

            if (int.TryParse(s, out var result))
                return result;

            throw new ArgumentException("Unable to parse year");
        }
    }
}
