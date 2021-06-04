using CalendarPrinter.Display;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CalendarPrinter.Commands
{
    interface ICommand
    {
        void Execute(IConsole console, CommandLineArgs args);
    }
}
