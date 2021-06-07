using Newtonsoft.Json;
using System.Collections.Generic;

namespace CalendarPrinter.Model
{
    public class TagMapping
    {
        [JsonProperty("icon")]
        public string Icon { get; set; }

        [JsonProperty("tags")]
        public List<string> Tags { get; set; }
        
        [JsonProperty("color")]
        public string Color { get; set; }
    }
}