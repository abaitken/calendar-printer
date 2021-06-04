using CalendarPrinter.Display;

namespace CalendarPrinter.Commands
{
    interface ICommandHelp
    {
        void DisplayHelp(IConsole console, CommandLineArgs args);
    }
}
