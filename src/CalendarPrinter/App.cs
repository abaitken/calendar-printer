using CalendarPrinter.Commands;
using CalendarPrinter.Display;
using System;

namespace CalendarPrinter
{
    internal class App
    {
        private IConsole _console;

        public App(IConsole console)
        {
            _console = console;
        }

        internal void Run(string[] args)
        {
            _console.DisplayHeader();
            var commandLineArgs = new CommandLineArgs(args);
            var factory = new CommandFactory();
            var command = factory.Create(commandLineArgs);
            command.Execute(_console, commandLineArgs);
        }
    }
}