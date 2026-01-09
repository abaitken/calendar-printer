import { PartialDate } from "./PartialDate.js";
import { EventSetList } from "./events/EventSetList.js";
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
        const nextMonthEvents = this.events({
            important: true,
            date: matchDates 
        }).map(e => e.detail);

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
        const result = this.events(date);
        return result;
    }

    remove(event) {
        const userEvents = this.eventSets().find(o => o instanceof UserEvents);

        if(!userEvents) {
            return;
        }

        userEvents.remove(event);
    }

    add(event) {
        let userEvents = this.eventSets().find(o => o instanceof UserEvents);

        if(!userEvents) {
            userEvents = this.eventSets().find(o => o instanceof EventSetList);
        }

        if(!userEvents) {
            userEvents = new UserEvents();
            this.addEventSet(userEvents);
        }
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
