import { PartialDate } from './PartialDate.js';
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
        this.icon = ko.observable('calendar');
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

    assignFromEvent(event) {
        this.name(event.detail.text());
        this.datePattern(event.datePattern);
        this.color(event.detail.color());
        this.icon(event.detail.icon());
    }

    validate() {

        let validationMessages = {};
        if(this.name().length === 0) {
            validationMessages.name = 'A name is required';
        }
        
        if(this.datePattern().length === 0) {
            validationMessages.datePattern = 'A date is required';
        }
        else if(!PartialDate.validate(this.datePattern())) {
            validationMessages.datePattern = 'A date must follow the pattern YYYY-MM-DD';
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
    datePatternBuilder;
    mode;
    original;

    constructor(elementId, parent) {
        super(elementId);
        this.calendar = parent.calendar;
        this.iconSelector = parent.iconSelector;
        this.datePatternBuilder = parent.datePatternBuilder;
        this.event = ko.observable(new EventModel());
        this.mode = ko.observable('add');
        this.original = null;
    }

    createEvent() {
        this.mode('add');
        this.event(new EventModel());
        super.open();
    }

    editEvent(event) {
        this.mode('edit');
        this.original = event;
        let model = new EventModel(); 
        model.assignFromEvent(event);
        this.event(model);
        super.open();
    }

    addEvent() {
        if(!this.event().validate()) {
            return;
        }
        const model = this.event();
        this.calendar.addEvent(model.asSimpleObject());
        this.calendar.updateEvents();
        this.calendar.save();
        this.event(new EventModel());
        this.close();
    }

    saveEvent() {
        if(!this.event().validate()) {
            return;
        }
        const model = this.event();
        this.original.update(model.asSimpleObject());
        this.calendar.updateEvents();
        this.calendar.save();
        this.event(new EventModel());
        this.original = null;
        this.close();
    }

    cancelAddEvent() {
        this.event(new EventModel());
        this.close();
    }

    changeIcon() {
        const event = this.event();
        this.iconSelector.openPicker(function(selection) {
            event.icon(selection);
        }, event.icon(), event.color());
    }

    createPattern() {
        const event = this.event();
        this.datePatternBuilder.open(function(pattern) {
            event.datePattern(pattern);
        }, event.datePattern());
    }
}
