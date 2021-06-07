using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace CalendarPrinter
{
    class ResourceLoader
    {
        private Assembly _assembly;

        public ResourceLoader()
        {
            _assembly = Assembly.GetExecutingAssembly();
        }

        public string ReadFile(string virtualFilePath)
        {
            var resourceName = BuildResourceName(virtualFilePath);
            using(var reader = new StreamReader(_assembly.GetManifestResourceStream(resourceName)))
            {
                return reader.ReadToEnd();
            }            
        }

        private string BuildResourceName(string virtualFilePath)
        {
            var builder = new StringBuilder();
            builder.Append(_assembly.GetName().Name);

            var parts = virtualFilePath.Split('/', StringSplitOptions.RemoveEmptyEntries);

            foreach (var item in parts)
            {
                builder.Append('.');
                builder.Append(item);
            }

            return builder.ToString();
        }
    }
}
