import { EventSetList } from "../events/EventSetList.js";
import { MoonPhase } from "../events/MoonPhase.js";
import { UKEvents } from "../events/UKEvents.js";
import { Modal } from "../modal.js";

export class AddEventSetModel extends Modal {
    calendar;
    name;
    types;
    selectedType;
    validationMessages;

    constructor(elementId, parent) {
        super(elementId);
        const self = this;
        this.calendar = parent.calendar;
        this.name = ko.observable('');
        this.types = [
            { name: 'User events', id: 'UserEvents', canName: true, factory: (name) => new EventSetList(name) },
            { name: 'UK events', id: 'UKEvents', canName: false, factory: () => new UKEvents() },
            { name: 'Moon phase', id: 'MoonPhase', canName: false, factory: () => new MoonPhase() }
        ];
        this.selectedType = ko.observable(this.types[0]);
        this.validationMessages = ko.observable({});
    }

    validate() {
        let validationMessages = {};
        if(this.name().length === 0) {
            validationMessages.name = 'A name is required';
        }
        this.validationMessages(validationMessages);
        const result = Object.keys(validationMessages).length == 0;
        return result;
    }

    addSet() {
        if(!this.validate()) {
            return;
        }

        const newSet = this.selectedType().factory(this.name());
        this.calendar.events.addEventSet(newSet);
        this.close();
    }
    
    afterClose() { 
        this.name('');
        this.selectedType(this.types[0]);
    }
}