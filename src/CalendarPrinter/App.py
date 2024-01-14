import argparse
import json
import os

from .Configuration import Configuration
from .EventCalendar import EventCalendar
from .TagsToIconConverter import TagsToIconConverter
from .GenerationFactory import GenerationFactory

class App:
    def ValidateArguments(self, args: argparse.Namespace) -> bool:
        if not os.path.isfile(args.config):
            print('ERROR! Configuration file not found!')
            return False
            
        if not os.path.isdir(args.outdir):
            print('ERROR! Output directory not found!')
            return False
            
        return True

    def LoadConfiguration(self, configurationFile: str) -> (bool, Configuration):
        # TODO : try catch
        f = open(configurationFile, 'r')
        jobj = json.load(f)
        f.close()
        configuration = Configuration(jobj)
        result = True
        return (result, configuration)

    def ValidateConfiguration(self, configuration: object) -> bool:    
        if configuration.range is None or configuration.range.start > configuration.range.end:
            print('Configuration is lacking a valid date range')
            return False
        
        return True
        
    def Run(self) -> int:
        parser = argparse.ArgumentParser(
            prog='CalendarPrinter',
            description='Generates printable Calendar with custom dates and icons')
        parser.add_argument('-c', '--config', help='Path to the JSON configuration file', metavar='FILE_PATH', required=True)
        parser.add_argument('-o', '--outdir', help='Output folder. Default: current folder', metavar='DIR_PATH', required=False, default=os.getcwd())
        args = parser.parse_args()
        
        if not self.ValidateArguments(args):
            return 1
        
        (loaded, configuration) = self.LoadConfiguration(args.config)

        if not loaded:
            print('ERROR! Failed to load configuration file!')
            return 1
        
        if not self.ValidateConfiguration(configuration):
            return 1
        
        
        eventCalendar = EventCalendar(configuration.dates)
        tagsToIcon = TagsToIconConverter(configuration.tag_mapping)
        generator = GenerationFactory().Create(configuration.style, configuration.format)
        generator.Create(configuration.range, eventCalendar, tagsToIcon, configuration, args.outdir)
        return 0