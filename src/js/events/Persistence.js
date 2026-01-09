import { EventSetList } from "./EventSetList.js";
import { MoonPhase } from "./MoonPhase.js";
import { UKEvents } from "./UKEvents.js";
import { UserEvents } from "./UserEvents.js";

export class Persistence {

    restore(calendar) {
        const events = window.localStorage.getItem('events');
        if(events) {
            const eventSet = new EventSetList('Migrated events');
            eventSet.hidden = true;
            const parsed = JSON.parse(events);
            parsed.forEach(event => eventSet.add(event));
            calendar.addEventSet(eventSet);
        }

        const eventSets = window.localStorage.getItem('eventSets');
        // if(eventSets) {
        //     return;
        // }

        calendar.addEventSet(new UserEvents());
        calendar.addEventSet(new UKEvents());
        calendar.addEventSet(new MoonPhase());
    }

    save(calendar) {
        const data = calendar.eventSets().map(o => o.serialize());
        window.localStorage.setItem('eventSets', JSON.stringify(data));

        window.localStorage.removeItem('events');
    }
}