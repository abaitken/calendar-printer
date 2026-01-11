import { Day } from './Day.js';
import { PartialDate } from './PartialDate.js';
import { EventSet } from './events/EventSet.js';
import { EventSetList } from './events/EventSetList.js';
import { UserEvents } from './events/UserEvents.js';
import { Modal } from './modal.js';

class EventModel {
    name;
    datePattern;
    color;
    icon;
    important;
    validationMessages;

    constructor() {
        this.name = ko.observable('');
        this.datePattern = ko.observable('');
        this.color = ko.observable('gray');
        this.icon = ko.observable('calendar');
        this.important = ko.observable(false);
        this.validationMessages = ko.observable({});
    }

    asSimpleObject() {
        return {
            text: this.name(),
            date: this.datePattern(),
            color: this.color(),
            icon: this.icon(),
            important: this.important()
        };
    }

    assignFromEvent(event) {
        this.name(event.detail.text());
        this.datePattern(event.datePattern);
        this.color(event.detail.color());
        this.icon(event.detail.icon());
        this.important(event.detail.important());
    }

    assignFromDay(day) {
        const dateToPattern = (date) => {
            const year = date.getFullYear();
            const month = `${date.getMonth() + 1}`.padStart(2, '0');
            const day = `${date.getDate()}`.padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        this.datePattern(dateToPattern(day.date));
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
    eventSets;
    selectedEventSet;

    constructor(elementId, parent) {
        super(elementId);
        const self = this;
        this.calendar = parent.calendar;
        this.iconSelector = parent.iconSelector;
        this.datePatternBuilder = parent.datePatternBuilder;
        this.event = ko.observable(new EventModel());
        this.mode = ko.observable('add');
        this.original = null;
        this.eventSets = ko.computed(function(){
            const eventSets = self.calendar.events.eventSets();
            const result = eventSets.filter(o => o instanceof EventSetList);
            return result;
        });
        const findDefaultEventSet = (eventCalendar) => {
            const eventSets = eventCalendar.eventSets();
            if(eventSets.length == 0) {
                return null;
            }

            let userEvents = eventSets.find(o => o instanceof UserEvents);
    
            if(!userEvents) {
                userEvents = eventSets.find(o => o instanceof EventSetList);
            }
    
            if(userEvents) {
                return null;
            }
            
            return userEvents;
        };
        this.selectedEventSet = ko.observable(findDefaultEventSet(parent.calendar.events));
    }

    createEvent(context) {
        this.mode('add');
        let model = new EventModel(); 
        if(context instanceof Day) {
            model.assignFromDay(context);
        }

        if(context instanceof EventSetList) {
            this.selectedEventSet(context);
        }
        this.event(model);
        super.open();
    }

    duplicateEvent(event) {
        this.mode('add');
        let model = new EventModel(); 
        model.assignFromEvent(event);
        this.event(model);
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
        this.selectedEventSet().addEvent(model.asSimpleObject());
        //this.calendar.addEvent(model.asSimpleObject());
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
        this.iconSelector.openPicker(event.icon(), event.color())
        .then((selection) => {
            event.icon(selection);
        })
        .catch(() => {
            /* Cancelled */
        });
    }

    createPattern() {
        const event = this.event();
        this.datePatternBuilder.open(function(pattern) {
            event.datePattern(pattern);
        }, event.datePattern());
    }
}
