namespace CalendarPrinter.Commands
{
    class CommandFactory
    {
        public ICommand Create(CommandLineArgs args)
        {
            if (args.Count == 0)
                return new DisplayHelpCommand();

            if(args.HasSwitch("?", "h", "help"))
                return new DisplayHelpCommand();

            return new GenerateCalendarCommand();
        }
    }
}
