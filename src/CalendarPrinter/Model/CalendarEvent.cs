using CalendarPrinter.Serialization;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace CalendarPrinter.Model
{
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
