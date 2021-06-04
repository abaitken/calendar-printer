using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CalendarPrinter.Display
{
    class Console : IConsole
    {
        public void DisplayHeader()
        {
            WriteLine("Calendar Printer");
            WriteLine();
        }

        public void WriteError(string text)
        {
            using (var color = new ConsoleColorScope(ConsoleColor.Red))
            {
                WriteLine(text);
            }
        }

        public void WriteLine()
        {
            System.Console.WriteLine();
        }

        public void WriteLine(string text)
        {
            System.Console.WriteLine(text);
        }

        class ConsoleColorScope : IDisposable
        {
            private bool _disposedValue;
            private readonly ConsoleColor _previousColor;

            public ConsoleColorScope(ConsoleColor color)
            {
                _previousColor = System.Console.ForegroundColor;
                System.Console.ForegroundColor = color;
            }

            protected virtual void Dispose(bool disposing)
            {
                if (!_disposedValue)
                {
                    if (disposing)
                    {
                        System.Console.ForegroundColor = _previousColor;
                    }

                    _disposedValue = true;
                }
            }

            public void Dispose()
            {
                Dispose(disposing: true);
                GC.SuppressFinalize(this);
            }
        }
    }
}
