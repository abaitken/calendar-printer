import { EventSetList } from './events/EventSetList.js';
import { Modal } from './modal.js';
import { RecordView } from './RecordView.js';

class EventSetModel {
    eventSet;
    calendar;
    addEventViewModel;
    search;
    name;
    canAlter;
    hidden;

    constructor(eventSet, parent) {
        const self = this;
        this.eventSet = eventSet;
        this.name = ko.computed(function() {
            return self.eventSet.name;
        })

        this.calendar = parent.calendar;
        this.search = ko.observable('');
        this.calendar.addEventListener('updateEvents', e => {
            this.events.refresh();
        });
        this.addEventViewModel = parent.addEvent;
        this.confirmModel = parent.confirmModel;
        this.events = new RecordView(
            () => this.getRecords(), 
            (eventName, record) => this.handleRecordEvent(eventName, record),
            (record) => this.filter(record),
            [
                { key: 'text', name: 'Text', sort: (l, r) => l.detail.text().localeCompare(r.detail.text()) },
                { key: 'important', name: 'Important', sortable: false },
                { key: 'pattern', name: 'Pattern', sort: (l, r) => l.datePattern.localeCompare(r.datePattern) },
                { key: 'icon', name: 'Icon', sort: (l, r) => l.detail.icon().localeCompare(r.detail.icon()) },
                { key: 'color', name: 'Color', sort: (l, r) => l.detail.color().localeCompare(r.detail.color()) },
                { key: 'actions', name: '', sortable: false },
            ]
        );
        this.search.subscribe(function() {
            self.events.refresh();
        });
        this.canAlter = ko.computed(function() {
            return self.eventSet instanceof EventSetList;
        });

        this.hidden = ko.observable(self.eventSet.hidden);
        this.hidden.subscribe(function(value) {
            self.eventSet.hidden = value;
            self.calendar.updateEvents();
        });
    }

    getRecords() {
        return this.eventSet.records();
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
        this.addEventViewModel.createEvent(this.eventSet);
    }

    toggleHidden(record) {
        record.hidden(!record.hidden());
        this.events.refresh();
    }

    hideSet() {
        this.hidden(!this.hidden());
    }
}

export class AllEventsModel extends Modal {
    calendar;
    eventSets;
    selectedEventSet;
    addSetCommand;

    constructor(elementId, parent) {
        super(elementId);
        const self = this;
        this.calendar = parent.calendar;
        this.addSetCommand = () => parent.runCommand('createset');
        this.eventSets = ko.computed(function() {
            const eventSets = self.calendar.events.eventSets();
            return eventSets.map(o => new EventSetModel(o, parent));
        });
        this.selectedEventSet = ko.observable(this.eventSets()[0]);
    }

    deleteSet() {
        throw new Error('Not implemented');
    }

    addSet() {
        this.addSetCommand();
    }
}
