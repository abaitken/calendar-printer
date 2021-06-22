using CalendarPrinter.Model;

namespace CalendarPrinter.Logic
{
    internal interface ICalendarGenerator
    {
        void Create(DateRange range, EventCalendar eventCalendar, TagsToIconConverter tagsToIcon, Configuration configuration, string outputPath);
    }
}