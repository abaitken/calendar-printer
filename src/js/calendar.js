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
    date;
    dow;
    events;
    text;

    constructor(calendar, month, day) {
        const self = this;
        this.date = ko.observable(new Date(calendar.year, month.index, day));
        this.dow = this.date().getDay();
        this.events = ko.observableArray([]);
        this.text = ko.computed(function () {
            return String(self.date().getDate()).padStart(2, '0');
        });
    }

    updateEvents(eventCalendar) {
        const events = eventCalendar.getEvents(this.date());
        this.events(events);
    }

}

class Week {
    days;

    constructor(calendar, month) {
        this.days = [];
    }

    updateEvents(eventCalendar) {
        this.days.filter(d => !!d).forEach(day => {
            day.updateEvents(eventCalendar);
        });
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
    year;
    month;
    index;
    title;
    weeks;
    nextMonthEvents;

    constructor(calendar, month) {
        this.year = calendar.year;
        this.month = month;
        this.index = month - 1;
        this.title = month_longnames[this.index] + ' ' + calendar.year;

        let weeks = [];

        const daysInMonth = new Date(calendar.year, this.index + 1, 0).getDate();

        let dayNumber = 1;

        let day = new Day(calendar, this, dayNumber);
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

            day = new Day(calendar, this, dayNumber);
            week.days.push(day);
            dayNumber++;
        }

        // Pad last week
        while (week.days.length < 7) {
            week.days.push(null);
        }
        weeks.push(week);

        this.weeks = weeks;
        this.nextMonthEvents = ko.observableArray([]);
    }

    updateEvents(eventCalendar) {
        this.weeks.forEach(week => {
            week.updateEvents(eventCalendar);

            let monthIterator = new MonthIterator(this.year, this.index);
            monthIterator.next();
            this.nextMonthEvents(eventCalendar.getMonthlyEventSummary(monthIterator.year, monthIterator.month));
        });
    }
}

class EventTime {
    datePattern;
    detail;

    constructor(datePattern, detail) {
        this.datePattern = datePattern;
        this.detail = detail;
    }

    getDowIndex(value) {
        switch (value) {
            case 'MON':
                return 1;
            case 'TUE':
                return 2;
            case 'WED':
                return 3;
            case 'THU':
                return 4;
            case 'FRI':
                return 5;
            case 'SAT':
                return 6;
            case 'SUN':
                return 0;

            default:
                return -1;
        }
    }

    match(date) {
        const patternParts = this.datePattern.split('-');
        const matchYear = patternParts[0];
        const matchMonth = patternParts[1];
        const matchDay = (patternParts.length > 2) ? patternParts[2] : null;

        let year = 0;
        let month = 0;
        let day = 0;

        if (typeof date === 'string') {
            const subjectParts = this.datePattern.split('-');
            year = Number(subjectParts[0]);
            month = Number(subjectParts[1]);
            day = (subjectParts.length > 2) ? Number(subjectParts[2]) : null;
        }

        if (typeof date === 'object') {
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
        }

        if (matchYear !== '####' && Number(matchYear) !== year) {
            return false;
        }

        if (matchMonth !== '##' && Number(matchMonth) !== month + 1) {
            return false;
        }

        if (!day) {
            return true;
        }

        if (matchDay === '##') {
            return true;
        }

        if (matchDay === '>>') {
            const lastDayOfMonth = new Date(year, month + 1, 0);
            if (lastDayOfMonth.getDate() !== day) {
                return false;
            }
            return true;
        }

        if (Number(matchDay) === day) {
            return true;
        }

        const matchDow = this.getDowIndex(matchDay);
        if (matchDow !== -1) {
            //const date = new Date(year, month, day);
            if (date.getDay() !== matchDow) {
                return false;
            }
            return true;
        }

        return false;
    }
}

class EventDetail {
    color;
    icon;
    text;

    constructor(color, icon, text) {
        this.color = color;
        this.icon = icon;
        this.text = text;
    }
}

class EventCalendar extends EventTarget {
    events;

    constructor() {
        super();
        this.events = [];
    }

    getMonthlyEventSummary(year, month) {
        const nextMonthEvents = this.events.filter(e => e.match(`${year}-${month}`)).map(e => e.detail);

        let result = [];
        for (let index = 0; index < nextMonthEvents.length; index++) {
            const event = nextMonthEvents[index];
            if(result.some(o => o.icon === event.icon && o.color == event.color)) {
                continue;
            }
            result.push(event);
        }
        return result;
    }

    getEvents(date) {
        const result = this.events.filter(e => e.match(date)).map(e => e.detail);
        return result;
    }

    add(event) {
        const datePattern = event.date;
        let text = event.text;
        const color = (event.color) ? event.color : 'grey';
        let icon = null;


        if(text.includes('🌓')) {
            //text = text.replace('🌓', '');
            //icon = '#moon-partial';
            icon = '#none';
        }

        if(text.includes('🌗')) {
            //text = text.replace('🌗', '');
            //icon = '#moon-partial';
            icon = '#none';
        }

        if(text.includes('🌕')) {
            //text = text.replace('🌕', '');
            //icon = '#moon-full';
            icon = '#none';
        }

        if(text.includes('🌑')) {
            //text = text.replace('🌑', '');
            //icon = '#moon-full';
            icon = '#none';
        }

        // TODO : Pull and setup match rules
        if(/easter/i.test(text)) {
            icon = '#egg-easter';
        }

        if(/new year/i.test(text)) {
            icon = '#party-popper';
        }

        if(/halloween/i.test(text)) {
            icon = '#halloween';
        }

        icon = (icon) ? icon : '#calendar';
        icon = (event.icon) ? event.icon : icon;

        this.events.push(new EventTime(datePattern, new EventDetail(color, icon, text)));
        this.raiseEventsChanged({ });
    }

    clear() {
        this.events = [];
        this.raiseEventsChanged({ });
    }

    raiseEventsChanged(args) {
        this.dispatchEvent(new CustomEvent('eventsChangedEvent', args));
    }
}

export class Calendar extends EventTarget {
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
        super();
        this.year = year;
        this.events = new EventCalendar();

        this.weekdays = this.createWeekdayArray(1 /* Monday */);

        let months = [];
        for (let month = 1; month <= 12; month++) {
            months.push(new Month(this, month));
        }

        this.months = months;
    }

    addEvent(event) {
        this.events.add(event);
    }

    updateEvents() {
        this.months.forEach(month => {
            month.updateEvents(this.events);
        });
        this.raiseUpdateEvents({});
    }

    clearEvents() {
        this.events.clear();
    }

    raiseUpdateEvents(args) {
        this.dispatchEvent(new CustomEvent('updateEvents', args));
    }
}

