namespace CalendarPrinter.Display
{
    interface IConsole
    {
        void DisplayHeader();
        void WriteLine();
        void WriteLine(string text);
        void WriteError(string text);
    }
}
