using CalendarPrinter.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CalendarPrinter.Logic
{
    class GenerationFactory
    {
        public ICalendarGenerator Create(CalendarOutputStyle style, CalendarOutputFormat format)
        {
            switch (format)
            {
                case CalendarOutputFormat.HTML:
                    return CreateHTMLStyleGenerator(style);
                case CalendarOutputFormat.PNG:
                    return CreatePNGStyleGenerator(style);
                case CalendarOutputFormat.SVG:
                    return CreateSVGStyleGenerator(style);
                default:
                    throw new ArgumentOutOfRangeException(nameof(format));
            }
        }

        private ICalendarGenerator CreatePNGStyleGenerator(CalendarOutputStyle style)
        {
            throw new ArgumentOutOfRangeException(nameof(style));
        }

        private ICalendarGenerator CreateSVGStyleGenerator(CalendarOutputStyle style)
        {
            switch (style)
            {
                case CalendarOutputStyle.MonthlyLandscape:
                    return new MonthlyLandscapeSVGGenerator();
                default:
                    throw new ArgumentOutOfRangeException(nameof(style));
            }
        }

        private ICalendarGenerator CreateHTMLStyleGenerator(CalendarOutputStyle style)
        {
            switch (style)
            {
                case CalendarOutputStyle.MonthlyLandscape:
                    return new MonthlyLandscapeHTMLGenerator();
                case CalendarOutputStyle.MonthlyPortrait:
                    return new MonthlyPortraitHTMLGenerator();
                default:
                    throw new ArgumentOutOfRangeException(nameof(style));
            }
        }
    }
}
