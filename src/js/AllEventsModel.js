import { AddEventModel } from './AddEventModel.js';
import { Modal } from './modal.js';
import { RecordView } from './RecordView.js';

export class AllEventsModel extends Modal {
    events;
    updateTrigger;
    calendar;
    addEventViewModel;
    search;

    constructor(elementId, parent) {
        super(elementId);
        this.calendar = parent.calendar;
        this.events = new RecordView(
            () => this.getRecords(), 
            (eventName, record) => this.handleRecordEvent(eventName, record),
            (record) => this.filter(record)
        );
        this.calendar.addEventListener('updateEvents', e => {
            this.events.refresh();
        });
        this.addEventViewModel = parent.addEvent;
        this.confirmModel = parent.confirmModel;
        this.search = ko.observable('');
        const self = this;
        this.search.subscribe(function() {
            self.events.refresh();
        });
    }

    filter(record) {
        const searchText = this.search();
        if(searchText.length == 0) {
            return true;
        }

        if(!record.detail.text().includes(searchText)) {
            return false;
        }
        return true;
    }

    getRecords() {
        const eventCalendar = this.calendar.events;
        return eventCalendar.events;
    }

    handleRecordEvent(eventName, record) {
        if(eventName === 'edit') {
            return this.editRecord(record);
        }
        if(eventName === 'delete') {
            return this.deleteRecord(record);
        }
        if(eventName === 'hide') {
            return this.toggleHidden(record);
        }
        if(eventName === 'dupe') {
            return this.duplicate(record);
        }

        throw new Error(`Unexpected event '${eventName}'`);
    }

    duplicate(record) {
        this.addEventViewModel.duplicateEvent(record);
    }

    editRecord(record) {
        this.addEventViewModel.editEvent(record);
    }

    deleteRecord(item) {
        this.calendar.events.remove(item);
        this.calendar.updateEvents(); // TODO : This is the wrong place to do this... it should be responsive from the EventCalendar itself
    }

    clearEvents() {
        this.confirmModel.confirm('Are you sure you want to clear all events?')
        .then(() => {
            this.calendar.clearEvents();
            this.calendar.updateEvents();
        })
        .catch(() => {
            /* Cancelled */
        });
    }

    addEvent() {
        this.addEventViewModel.createEvent();
    }

    toggleHidden(record) {
        record.hidden(!record.hidden());
        this.events.refresh();
    }
}
