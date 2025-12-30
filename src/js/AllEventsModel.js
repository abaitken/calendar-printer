import { AddEventModel } from './AddEventModel.js';
import { Modal } from './modal.js';
import { RecordView } from './RecordView.js';

export class AllEventsModel extends Modal {
    events;
    updateTrigger;
    calendar;
    addEventViewModel;

    constructor(elementId, parent) {
        super(elementId);
        this.calendar = parent.calendar;
        this.events = new RecordView(() => this.getRecords(), (eventName, record) => this.handleRecordEvent(eventName, record));
        this.calendar.addEventListener('updateEvents', e => {
            this.events.refresh();
        });
        this.addEventViewModel = parent.addEvent;
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
    }

    editRecord(record) {
        this.addEventViewModel.editEvent(record);
    }

    deleteRecord(item) {
        this.calendar.events.remove(item);
        this.calendar.updateEvents(); // TODO : This is the wrong place to do this... it should be responsive from the EventCalendar itself
    }

    clearEvents() {
        this.calendar.clearEvents();
        this.calendar.updateEvents();
    }

    addEvent() {
        this.addEventViewModel.createEvent();
    }

    toggleHidden(record) {
        record.hidden(!record.hidden());
        this.events.refresh();
    }
}
