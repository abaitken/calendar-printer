import { EventDetail } from "../EventDetail.js";
import { EventTime } from "../EventTime.js";
import { StorageManager } from "../StorageManager.js";
import { EventSetList } from "./EventSetList.js";
import { MoonPhase } from "./MoonPhase.js";
import { UKEvents } from "./UKEvents.js";
import { UserEvents } from "./UserEvents.js";

export class Persistence {

    restore(calendar) {
        const storage = new StorageManager();
        const events = storage.fetch('events');
        if (events) {
            const eventSet = new EventSetList('Migrated events');
            eventSet.hidden = true;
            events.forEach(event => eventSet.add(event));
            calendar.addEventSet(eventSet);
        }

        const eventSets = storage.fetch('eventSets');
        if (eventSets) {

            for (let index = 0; index < eventSets.length; index++) {
                const dataSet = eventSets[index];

                if (dataSet.type === 'MoonPhase') {
                    calendar.addEventSet(new MoonPhase());
                    continue;
                }

                if (dataSet.type === 'UKEvents') {
                    let events = [];

                    if (dataSet.events) {
                        for (let index = 0; index < dataSet.events.length; index++) {
                            const event = dataSet.events[index];
                            events.push(new EventTime(event.date, new EventDetail(event.color, event.icon, event.text, event.important)));
                        }
                    }
                    const restoreSet = new UKEvents(events);
                    calendar.addEventSet(restoreSet);
                    continue;
                }

                if (dataSet.type === 'UserEvents') {
                    const restoreSet = new UserEvents();

                    if (dataSet.events) {
                        for (let index = 0; index < dataSet.events.length; index++) {
                            const event = dataSet.events[index];
                            restoreSet.add(event);
                        }
                    }
                    calendar.addEventSet(restoreSet);
                    continue;
                }
            }

            if (calendar.events.eventSets().length != 0) {
                return;
            }
        }

        calendar.addEventSet(new UserEvents());
        calendar.addEventSet(new UKEvents());
        calendar.addEventSet(new MoonPhase());
    }

    save(calendar) {
        const data = calendar.eventSets().map(o => o.serialize());
        const storage = new StorageManager();
        storage.store('eventSets', data);

        storage.clear('events');
    }
}