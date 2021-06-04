using CalendarPrinter.Serialization;
using Newtonsoft.Json;
using System;

namespace CalendarPrinter.Model
{
    public class DateRange
    {
        [JsonProperty("start")]
        [JsonConverter(typeof(PartialDateConverter))]
        public DateTime Start { get; set; }

        [JsonProperty("end")]
        [JsonConverter(typeof(PartialDateConverter))]
        public DateTime End { get; set; }
    }
}
