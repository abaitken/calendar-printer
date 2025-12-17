import { Calendar } from './calendar.js';
import { EventReader } from './eventreader.js';
import { AddEventModel } from './addevent.js';
import { AllEventsModel } from './allevents.js';

class ViewModel {
    calendar;
    addEvent;
    allEvents;

    constructor() {
        // TODO : Make configurable
        const currentYear = new Date().getFullYear();
        this.calendar = new Calendar(currentYear);
        this.addEvent = new AddEventModel('addEventModal', this);
        this.allEvents = new AllEventsModel('allEventsModal', this);
    }

    openEventAddModal() {
        this.addEvent.open();
    }

    openAllEvents() {
        this.allEvents.open();
    }

    openSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.add('sidebar-open');
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('sidebar-open');
    }

    clearEvents() {
        this.calendar.clearEvents();
        this.calendar.updateEvents();
    }

    uploadEvents() {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
    }

    onUpload(event) {
        if (!event || !event.target || !event.target.files) {
            return;
        }

        const self = this;
        const eventReader = new EventReader();
        let promises = [];
        for (let index = 0; index < event.target.files.length; index++) {
            const file = event.target.files[index];
            const promise = eventReader.readFile(file).then((events) => {
                events.forEach(event => {
                    self.calendar.addEvent(event);
                });
            });
            promises.push(promise);
        }

        Promise.all(promises).then(() => {
            self.calendar.updateEvents();
        });
    }

    init() {
        ko.applyBindings(this);

        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (event) => this.onUpload(event));
    }
}

var root = new ViewModel();
root.init();
