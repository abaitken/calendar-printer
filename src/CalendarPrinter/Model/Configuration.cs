using CalendarPrinter.Serialization;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CalendarPrinter.Model
{
    public class Configuration
    {
        [JsonProperty("dates")]
        public List<CalendarEvent> Dates { get; set; }
        
        [JsonProperty("range")]
        public DateRange Range { get; set; }

        [JsonProperty("format")]
        public CalendarOutputFormat Format { get; set; }

        [JsonProperty("style")]
        public CalendarOutputStyle Style { get; set; }
    }
}
