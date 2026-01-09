import { PartialDate } from "./PartialDate.js";
import { Persistence } from "./events/Persistence.js";
import { UserEvents } from "./events/UserEvents.js";

export class EventCalendar extends EventTarget {
    eventSets;

    constructor() {
        super();
        this.eventSets = ko.observableArray([]);
    }

    events(filter) {
        let events = [];
        for (let index = 0; index < this.eventSets().length; index++) {
            const eventSet = this.eventSets()[index];
            events = events.concat(eventSet.get(filter));
        }
        return events;
    }

    getMonthlyEventSummary(year, month) {
        const matchDates = new PartialDate(year, month);
        const nextMonthEvents = this.events(e => e.detail.important() && e.match(matchDates))
            .map(e => e.detail);

        let result = [];
        for (let index = 0; index < nextMonthEvents.length; index++) {
            const event = nextMonthEvents[index];
            if (result.some(o => o.icon === event.icon && o.color == event.color)) {
                continue;
            }
            result.push(event);
        }
        return result;
    }

    getEvents(date) {
        const result = this.events(e => e.match(date));
        return result;
    }

    remove(event) {
        const userEvents = this.eventSets().find(o => o instanceof UserEvents);
        userEvents.remove(event);
    }

    add(event) {
        const userEvents = this.eventSets().find(o => o instanceof UserEvents);
        userEvents.add(event);
    }

    addEventSet(eventSet) {
        this.eventSets.push(eventSet);
    }

    clear() {
        this.eventSets([]);
    }

    save() {
        const storage = new Persistence();
        storage.save(this);
    }
}
