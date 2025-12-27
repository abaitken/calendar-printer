export class StorageEvents {
    events;

    constructor() {
        const events = window.localStorage.getItem('events');
        this.events = [];

        if(!events) {
            return;
        }
        this.events = JSON.parse(events);
    }

    save(events) {
        window.localStorage.setItem('events', JSON.stringify(events));
    }
}