import { EventDetail } from "./EventDetail.js";
import { EventTime } from "./EventTime.js";
import { PartialDate } from "./PartialDate.js";
import { StorageEvents } from "./StorageEvents.js";

export class EventCalendar extends EventTarget {
    events;

    constructor() {
        super();
        this.events = [];
    }

    getMonthlyEventSummary(year, month) {
        const matchDates = new PartialDate(year, month);
        const nextMonthEvents = this.events.filter(e => e.match(matchDates)).map(e => e.detail);

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
        const result = this.events.filter(e => e.match(date)).map(e => e.detail);
        return result;
    }

    remove(event) {
        const index = this.events.findIndex(item => item.uuid === event.uuid);
        if (index !== 1) this.events.splice(index, 1);
    }

    add(event) {
        const datePattern = event.date;
        let text = event.text;
        const color = (event.color) ? event.color : 'grey';
        let icon = null;


        if (text.includes('🌓')) {
            //text = text.replace('🌓', '');
            //icon = '#moon-partial';
            icon = '#none';
        }

        if (text.includes('🌗')) {
            //text = text.replace('🌗', '');
            //icon = '#moon-partial';
            icon = '#none';
        }

        if (text.includes('🌕')) {
            //text = text.replace('🌕', '');
            //icon = '#moon-full';
            icon = '#none';
        }

        if (text.includes('🌑')) {
            //text = text.replace('🌑', '');
            //icon = '#moon-full';
            icon = '#none';
        }

        // TODO : Pull and setup match rules
        if (/easter/i.test(text)) {
            icon = '#egg-easter';
        }

        if (/new year/i.test(text)) {
            icon = '#party-popper';
        }

        if (/halloween/i.test(text)) {
            icon = '#halloween';
        }

        icon = (icon) ? icon : '#calendar';
        icon = (event.icon) ? event.icon : icon;

        this.events.push(new EventTime(datePattern, new EventDetail(color, icon, text)));
        this.raiseEventsChanged({});
    }

    clear() {
        this.events = [];
        this.raiseEventsChanged({});
    }

    raiseEventsChanged(args) {
        this.dispatchEvent(new CustomEvent('eventsChangedEvent', args));
    }

    save() {
        const storage = new StorageEvents();
        const data = this.events.map(o => o.serialize());
        storage.save(data);
    }
}
