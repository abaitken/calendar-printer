using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CalendarPrinter.Model
{
    public class YearMonth
    {
        public int Year { get; set; }
        public int Month { get; set; }

        internal DateTime ToFirstDay()
        {
            return new DateTime(Year, Month, 1);
        }

        internal YearMonth AddMonths(int value)
        {
            return ToFirstDay().AddMonths(value).ToYearMonth();
        }
    }
}
