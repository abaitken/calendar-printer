import { Modal } from './modal.js';

class EventModel {
    name;
    datePattern;
    color;
    icon;

    constructor() {
        this.name = ko.observable('');
        this.datePattern = ko.observable('');
        this.color = ko.observable('');
        this.icon = ko.observable('');
    }

    asSimpleObject() {
        return {
            text: this.name(),
            date: this.datePattern(),
            color: this.color(),
            icon: this.icon()
        };
    }
}

export class AddEventModel extends Modal {
    event;
    calendar;

    constructor(elementId, parent) {
        super(elementId);
        this.calendar = parent.calendar;
        this.event = ko.observable(new EventModel());
    }

    addEvent() {
        this.calendar.addEvent(this.event().asSimpleObject());
        this.calendar.updateEvents();
        this.event(new EventModel());
        this.close();
    }

    cancelAddEvent() {
        this.event(new EventModel());
        this.close();
    }
}
