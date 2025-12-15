const month_longnames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const weekday_longnames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weekday_shortnames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekday_letter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
 
function Weekday(nativeIndex)
{
    var self = this;
    self.nativeIndex = nativeIndex;
    self.name = weekday_letter[nativeIndex];
}    

function Day(calendar, month, day)
{
    var self = this;
    self.day = day;
    const date = new Date(calendar.year, month.index, day);
    self.dow = date.getDay();
}

function Week(calendar, month)
{
    var self = this;
    self.days = [];
}

function WeekDayIterator(start)
{
    var self = this;
    self.dow = start;
    self.next = function() {
        self.dow ++;
        if(self.dow > 6) {
            self.dow = 0;
        }
    };
}

function Month(calendar, month)
{
    var self = this;
    self.month = month;
    self.index = month - 1;
    self.title = ko.observable(month_longnames[self.index]);
    
    let weeks = [];
    
    const daysInMonth = new Date(calendar.year, self.index + 1, 0).getDate();
    
    let dayNumber = 1;
    
    let day = new Day(calendar, self, dayNumber);
    let week = new Week(calendar, self);
    
    // Pad start of first week
    let dowIterator = new WeekDayIterator(calendar.weekdays[0].nativeIndex);
    while(day.dow !== dowIterator.dow) {
        week.days.push(null);
        dowIterator.next();
    }
    
    week.days.push(day);
    dayNumber++;
    
    // Iterate days and add to current week
    while(dayNumber <= daysInMonth) {
        day = new Day(calendar, self, dayNumber);
        week.days.push(day);        
        dayNumber++;
        
        // Rotate week when it is full
        if(week.days.length >= 7) {
            weeks.push(week);
            week = new Week(calendar, self);
        }
    }
    
    // Pad last week
    while(week.days.length < 7) {
        week.days.push(null);
    }
    weeks.push(week);
    
    self.weeks = weeks;
}

function createWeekdayArray(startIndex)
{
    let result = [];
    let iterator = new WeekDayIterator(startIndex);
    while(result.length < 7) {
        result.push(new Weekday(iterator.dow));
        iterator.next();
    }
    
    return result;
}

export function Calendar(year)
{
    var self = this;
    self.year = year;
    
    self.weekdays = createWeekdayArray(1 /* Monday */);
    
    let months = [];
    for(let month = 1; month <= 12; month ++) {
        months.push(new Month(self, month));
    }
    
    self.months = months;
}

