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

class Weekday {
    nativeIndex;
    name;

    constructor(nativeIndex) {
        this.nativeIndex = nativeIndex;
        this.name = weekday_longnames[nativeIndex];
    }
}

class Day {
    day;
    text;
    dow;
    events;

    constructor(calendar, month, day, eventCalendar) {
        this.day = day;
        this.text = String(day).padStart(2, '0');;
        const date = new Date(calendar.year, month.index, day);
        this.dow = date.getDay();
        this.events = eventCalendar.getEvents(calendar.year, month.index, day);
    }
}

class Week {
    days;

    constructor(calendar, month) {
        this.days = [];
    }
}

class WeekDayIterator {
    dow;

    constructor(start) {
        this.dow = start;
    }

    next() {
        this.dow++;
        if (this.dow > 6) {
            this.dow = 0;
        }
    }
}

class MonthIterator {
    year;
    month;

    constructor(year, month) {
        this.year = year;
        this.month = month;
    }

    next() {
        this.month++;
        if (this.month > 11) {
            this.year++;
            this.month = 0;
        }
    }
}

class Month {
    month;
    index;
    title;
    weeks;
    nextMonthEvents;

    constructor(calendar, month, eventCalendar) {
        this.month = month;
        this.index = month - 1;
        this.title = month_longnames[this.index] + ' ' + calendar.year;

        let weeks = [];

        const daysInMonth = new Date(calendar.year, this.index + 1, 0).getDate();

        let dayNumber = 1;

        let day = new Day(calendar, this, dayNumber, eventCalendar);
        let week = new Week(calendar, this);

        // Pad start of first week
        let dowIterator = new WeekDayIterator(calendar.weekdays[0].nativeIndex);
        while (day.dow !== dowIterator.dow) {
            week.days.push(null);
            dowIterator.next();
        }

        week.days.push(day);
        dayNumber++;

        // Iterate days and add to current week
        while (dayNumber <= daysInMonth) {
            // Rotate week when it is full
            if (week.days.length >= 7) {
                weeks.push(week);
                week = new Week(calendar, this);
            }

            day = new Day(calendar, this, dayNumber, eventCalendar);
            week.days.push(day);
            dayNumber++;
        }

        // Pad last week
        while (week.days.length < 7) {
            week.days.push(null);
        }
        weeks.push(week);

        this.weeks = weeks;
        let monthIterator = new MonthIterator(calendar.year, this.index);
        monthIterator.next();
        this.nextMonthEvents = eventCalendar.getMonthlyEventSummary(monthIterator.year, monthIterator.month);
    }
}

class EventSummary {
    color;
    icon;

    constructor(color, icon) {
        this.color = color;
        this.icon = icon;
    }
}
class Event {
    color;
    icon;
    text;

    constructor(color, icon, text) {
        this.color = color;
        this.icon = icon;
        this.text = text;
    }
}

class EventCalendar {
    constructor() {

    }
    
    getMonthlyEventSummary(year, month) {
        if(month === 1) {
            return [
                new EventSummary('red', '#bank-off')
            ];
        }

        return [];
    }

    getEvents(year, month, day) {
        if(month === 1 && day == 1) {
            return [
                new Event('red', '#bank-off', 'New Years Day')
            ];
        }

        return [];
    }
}

export class Calendar {
    year;
    weekdays;
    months;
    events;

    createWeekdayArray(startIndex) {
        let result = [];
        let iterator = new WeekDayIterator(startIndex);
        while (result.length < 7) {
            result.push(new Weekday(iterator.dow));
            iterator.next();
        }

        return result;
    }

    constructor(year) {
        this.year = year;
        this.events = new EventCalendar();

        this.weekdays = this.createWeekdayArray(1 /* Monday */);

        let months = [];
        for (let month = 1; month <= 12; month++) {
            months.push(new Month(this, month, this.events));
        }

        this.months = months;
    }
}

