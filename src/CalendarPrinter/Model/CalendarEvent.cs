using CalendarPrinter.Serialization;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics;

namespace CalendarPrinter.Model
{
    [DebuggerDisplay("{Date}: {Text}")]
    public class CalendarEvent
    {
        [JsonProperty("date")]
        [JsonConverter(typeof(PartialDateConverter))]
        public PartialDate Date { get; set; }

        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("tags")]
        public List<string> Tags { get; set; }
    }
}
