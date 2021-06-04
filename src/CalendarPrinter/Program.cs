using System;

namespace CalendarPrinter
{
    class Program
    {
        static void Main(string[] args)
        {
            new App(new Display.Console()).Run(args);
        }
    }
}
