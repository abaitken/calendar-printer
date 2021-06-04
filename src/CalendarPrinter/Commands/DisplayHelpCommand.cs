using CalendarPrinter.Display;
using System;

namespace CalendarPrinter.Commands
{
    internal class DisplayHelpCommand : ICommand
    {
        public void Execute(IConsole console, CommandLineArgs args)
        {
            new GenerateCalendarCommand().DisplayHelp(console, args);
        }
    }
}
