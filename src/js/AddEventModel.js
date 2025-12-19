import { Modal } from './modal.js';

class EventModel {
    name;
    datePattern;
    color;
    icon;
    validationMessages;

    constructor() {
        this.name = ko.observable('');
        this.datePattern = ko.observable('');
        this.color = ko.observable('gray');
        this.icon = ko.observable('#calendar');
        this.validationMessages = ko.observable({});
    }

    asSimpleObject() {
        return {
            text: this.name(),
            date: this.datePattern(),
            color: this.color(),
            icon: this.icon()
        };
    }

    validate() {
        let validationMessages = {};
        if(this.name().length === 0) {
            validationMessages.name = 'A name is required';
        }
        if(this.datePattern().length === 0) {
            validationMessages.datePattern = 'A date is required';
        }
        if(this.color().length === 0) {
            validationMessages.color = 'A color is required';
        }
        if(this.icon().length === 0) {
            validationMessages.icon = 'An icon is required';
        }
        this.validationMessages(validationMessages);
        const result = Object.keys(validationMessages).length == 0;
        return result;
    }
}

export class AddEventModel extends Modal {
    event;
    calendar;
    iconSelector;

    constructor(elementId, parent) {
        super(elementId);
        this.calendar = parent.calendar;
        this.iconSelector = parent.iconSelector;
        this.event = ko.observable(new EventModel());
    }

    addEvent() {
        if(!this.event().validate()) {
            return;
        }
        this.calendar.addEvent(this.event().asSimpleObject());
        this.calendar.updateEvents();
        this.event(new EventModel());
        this.close();
    }

    cancelAddEvent() {
        this.event(new EventModel());
        this.close();
    }

    changeIcon() {
        const event = this.event();
        this.iconSelector.open(function(selection) {
            event.icon(selection);
        }, event.icon(), event.color());
    }
}
