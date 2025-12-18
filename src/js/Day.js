export class Day {
    date;
    dow;
    events;
    text;

    constructor(calendar, month, day) {
        const self = this;
        this.date = new Date(month.year, month.index, day);
        this.dow = this.date.getDay();
        this.events = ko.observableArray([]);
        this.text = String(self.date.getDate()).padStart(2, '0');
    }

    updateEvents(eventCalendar) {
        const events = eventCalendar.getEvents(this.date);
        this.events(events);
    }
}
