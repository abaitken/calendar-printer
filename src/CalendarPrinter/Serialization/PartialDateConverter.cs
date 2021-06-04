using CalendarPrinter.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CalendarPrinter.Serialization
{

    public class PartialDateConverter : JsonConverter
    {
        public override bool CanWrite => false;

        public override bool CanConvert(Type objectType)
        {
            if (objectType == typeof(DateTime))
                return true;

            if (objectType == typeof(PartialDate))
                return true;

            return false;
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var value = reader.Value.ToString();
            if (objectType == typeof(DateTime))
                return ParseDateTime(value);

            if (objectType == typeof(PartialDate))
                return PartialDate.Parse(value);

            throw new InvalidOperationException();
        }

        private DateTime ParseDateTime(string value)
        {
            return DateTime.Parse(value);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }
    }
}
