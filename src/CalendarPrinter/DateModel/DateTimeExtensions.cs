using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CalendarPrinter
{
    internal static class DateTimeExtensions
    {
        public static DateTime NextMonth(this DateTime time)
        {
            return time.AddMonths(1);
        }
    }
}
