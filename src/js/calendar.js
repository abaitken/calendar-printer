import { EventDetail } from "./EventDetail.js";
import { EventTime } from "./EventTime.js";
import { Month } from "./Month.js";
import { Resources } from "./Resources.js";
import { Weekday } from "./Weekday.js";
import { WeekDayIterator } from "./WeekDayIterator.js";

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

    remove(event) {
        const index = this.events.findIndex(item => item.uuid === event.uuid);
        if(index !== 1) this.events.splice(index, 1);
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

class RangeIterator {
    startRange;
    endRange;
    currentDate;

    constructor(startRange, endRange) {
        this.startRange = startRange;
        this.endRange = endRange;
        this.currentDate = startRange;
    }

    current() {
        if(this.currentDate > this.endRange) {
            return null;
        }
        return this.currentDate;
    }

    nextMonth() {
        let year = this.currentDate.getFullYear();
        let month = this.currentDate.getMonth();
        let day = this.currentDate.getDate();

        month++;
        if(month > 11) {
            month = 0;
            year++;
        }
        this.currentDate = new Date(year, month, day);
        
        return this.current();
    }
}

export class Calendar extends EventTarget {
    startRange;
    endRange;
    weekdays;
    months;
    events;
    firstDow;
    resources;

    createWeekdayArray(startIndex) {
        let result = [];
        let iterator = new WeekDayIterator(startIndex);
        const resources = new Resources();
        while (result.length < 7) {
            result.push(new Weekday(iterator.dow, resources));
            iterator.next();
        }

        return result;
    }

    constructor(startRange, endRange) {
        super();
        this.startRange = startRange;
        this.endRange = endRange;

        this.events = new EventCalendar();
        this.months = ko.observableArray([]);

        this.firstDow = 1 /* Monday */;
        this.weekdays = [];
        this.resources = new Resources();
    }

    build() {
        this.weekdays = this.createWeekdayArray(this.firstDow);

        let iterator = new RangeIterator(this.startRange, this.endRange);
        let current = iterator.current();

        let months = [];
        while(current) {
            months.push(new Month(this, current.getFullYear(), current.getMonth()));
            current = iterator.nextMonth();
        }

        this.months(months);
    }

    addEvent(event) {
        this.events.add(event);
    }

    updateEvents() {
        this.months().forEach(month => {
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

    getMonthName(index) {
        return this.resources.month_longnames[index];
    }
}

