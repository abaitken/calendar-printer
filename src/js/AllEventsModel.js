import { Modal } from './modal.js';
import { RecordView } from './RecordView.js';

export class AllEventsModel extends Modal {
    events;
    updateTrigger;
    calendar;

    constructor(elementId, parent) {
        super(elementId);
        this.calendar = parent.calendar;
        this.events = new RecordView(() => this.getRecords(), (eventName, record) => this.handleRecordEvent(eventName, record));
        this.calendar.addEventListener('updateEvents', e => {
            this.events.refresh();
        });
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
    }

    editRecord(record) {
        console.log('edit');
        console.log(record);
    }

    deleteRecord(item) {
        this.calendar.events.remove(item);
        this.calendar.updateEvents(); // TODO : This is the wrong place to do this... it should be responsive from the EventCalendar itself
    }

    clearEvents() {
        this.calendar.clearEvents();
        this.calendar.updateEvents();
    }
}
