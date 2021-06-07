using CalendarPrinter.Display;
using CalendarPrinter.Logic;
using CalendarPrinter.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace CalendarPrinter.Commands
{
    internal class GenerateCalendarCommand : ICommand, ICommandHelp
    {
        public void DisplayHelp(IConsole console, CommandLineArgs args)
        {
            console.WriteLine(@"Generates printable calendars.

Args:
    -c <configuration file>          Path to the JSON configuration file
    -o <output folder>               Output folder. Default: current folder
");
        }

        class CommandOptions
        {
            public string ConfigurationFile { get; set; }
            public string OutputPath { get; set; }
        }

        public void Execute(IConsole console, CommandLineArgs args)
        {
            if (!ValidateArguments(console, args, out var commandOptions))
                return;

            if (!LoadConfiguration(console, commandOptions.ConfigurationFile, out var configuration))
                return;

            if (!ValidateConfiguration(console, configuration))
                return;

            var eventCalendar = new EventCalendar(configuration.Dates);
            var tagsToIcon = new TagsToIconConverter(configuration.TagMapping);
            var generator = new GenerationFactory().Create(configuration.Style, configuration.Format);
            generator.Create(configuration.Range, eventCalendar, tagsToIcon, commandOptions.OutputPath);
        }

        private bool ValidateConfiguration(IConsole console, Configuration configuration)
        {
            if (configuration.Range == null || configuration.Range.Start > configuration.Range.End)
            {
                console.WriteError($"Configuration is lacking a valid date range");
                return false;
            }

            if (configuration.Dates == null)
                configuration.Dates = new List<CalendarEvent>();

            return true;
        }

        private bool LoadConfiguration(IConsole console, string configurationFile, out Configuration configuration)
        {
            try
            {
                using var streamReader = new StreamReader(configurationFile);
                using var reader = new JsonTextReader(streamReader);
                var serializer = new JsonSerializer();

                configuration = (Configuration)serializer.Deserialize(reader, typeof(Configuration));
                return true;

            }
            catch (Exception ex)
            {
                console.WriteError($"Failed to load configuration file: {ex.Message}");
                configuration = null;
                return false;
            }

        }

        private bool ValidateArguments(IConsole console, CommandLineArgs args, out CommandOptions commandOptions)
        {
            commandOptions = new CommandOptions()
            {
                ConfigurationFile = args["c"],
                OutputPath = args["o"]
            };

            if (string.IsNullOrEmpty(commandOptions.ConfigurationFile))
            {
                console.WriteError("Must provide path to configuration file");
                return false;
            }

            if (!File.Exists(commandOptions.ConfigurationFile))
            {
                console.WriteError("Configuration file does not exist");
                return false;
            }

            if (string.IsNullOrEmpty(commandOptions.OutputPath))
                commandOptions.OutputPath = Environment.CurrentDirectory;
            else if (!Directory.Exists(commandOptions.OutputPath))
            {
                console.WriteError("Output directory does not exist");
                return false;
            }


            return true;
        }
    }
}
