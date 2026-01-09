import { EventSet } from "./EventSet.js";
import { EventTime } from "../EventTime.js";
import { EventDetail } from "../EventDetail.js";

export class EventSetList extends EventSet {
    events;

    constructor(name, events) {
        super(name);

        if(events) {
            this.events = events;
        } else {
            this.events = [];
        }
    }

    records() {
        return this.events;
    }

    get(filterPredicate) {
        if(this.hidden) {
            return [];
        }
        const filterObj = EventSet.resolveFilter(filterPredicate);
        return this.events.filter(e => filterObj.predicate(e));
    }

    serialize() {
        return {
            type: this.constructor.name,
            name: super.name,
            events: this.events.map(o => o.serialize())
        };
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

        let important = (event.important) ? event.important : false;

        this.events.push(new EventTime(datePattern, new EventDetail(color, icon, text, important)));
    }
}