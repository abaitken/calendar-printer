import { EventCalendar } from "./EventCalendar.js";
import { Month } from "./Month.js";
import { RangeIterator } from "./RangeIterator.js";
import { Resources } from "./Resources.js";
import { Weekday } from "./Weekday.js";
import { WeekDayIterator } from "./WeekDayIterator.js";

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

