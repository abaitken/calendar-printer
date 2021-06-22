# Configuration 

Use the example file for reference.

## Dates/Events

Dates are important events which are desired to be displayed on the calendar.

The date attribute is a custom format and must be specified in the YEAR-MONTH-DAY format.

Recurring dates can be added by replacing entire values with the hash (#) character.

For example, birthdays would be defined as ####-06-12, a reminder on the first of every month would be defined as ####-##-01

The dates also contain a text attribute which will be displayed on the calendar day.

The tags attribute provides filtering, classification and icon mapping for various purposes.

### Special use tags

ignore: Events with this tag will not be included in the calendar.

## Tag Mapping

Events are mapped to an icon and colour via whether all of the specified tags are matched to the event tags. To clarify, an event may have more tags than specified by the mapping, but if all the tags specified on the mapping are matched, then the event will inherit the icon and colour.

The mapping works through the list in the defined order, the first item to match the criteria will assign the icon and colour.

## Important Tags

Important tags are used as part of the icons displayed for next month. Any matching tag will be included in this section.

The use of an asterix tag (`*`) will result in all events being included.

## Range

Defines the start and end range of which calendars to generate. Dates must be formatted in the YEAR-MONTH format.

## Format

Output format. Valid values: html, svg, png

Currently html is the most well defined output.

## Style

The style in which to output the calendar.

Valid values: monthlylandscape, monthlyportrait
