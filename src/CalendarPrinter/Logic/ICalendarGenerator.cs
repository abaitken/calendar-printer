using CalendarPrinter.Model;

namespace CalendarPrinter.Logic
{
    internal interface ICalendarGenerator
    {
        void Create(DateRange range, EventCalendar eventCalendar, TagsToIconConverter tagsToIcon, string outputPath);
    }
}