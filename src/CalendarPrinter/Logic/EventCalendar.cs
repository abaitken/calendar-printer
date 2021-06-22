using CalendarPrinter.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CalendarPrinter.Logic
{
    class EventCalendar
    {
        private List<CalendarEvent> _dates;

        public EventCalendar(List<CalendarEvent> dates)
        {
            _dates = dates;
        }
        internal IEnumerable<CalendarEvent> FindAll(YearMonth month)
        {
            foreach (var item in _dates)
            {
                if (item.Date.Intersects(month))
                    yield return item;
            }
        }

        internal IEnumerable<CalendarEvent> FindAll(DateTime date)
        {
            foreach (var item in _dates)
            {
                if (item.Date.Intersects(date))
                    yield return item;
            }
        }
    }
}
