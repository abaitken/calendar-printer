import { Modal } from "./modal.js";

export class SettingsModel extends Modal {
    calendar;
    startDate;
    endDate;
    firstDow;
    dows;
    
    constructor(elementId, parent) {
        super(elementId);
        this.calendar = parent.calendar;
        this.startDate = ko.observable(this.calendar.startRange);
        this.endDate = ko.observable(this.calendar.endRange);
        this.firstDow = ko.observable(this.calendar.firstDow);
        this.dows = this.calendar.createWeekdayArray(0);

        const self = this;
        this.startDate.subscribe(function(newValue) {
            const value = new Date(newValue.getFullYear(), newValue.getMonth(), 1);
            if(value.getDate() != newValue.getDate()) {
                self.startDate(value);
                return;
            }
            self.calendar.startRange = value;

            if(self.calendar.endRange <= value) {
                self.endDate(new Date(newValue.getFullYear(), newValue.getMonth() + 2, 0));
                return;
            }
            
            self.refreshCalendar();
        });
        
        this.endDate.subscribe(function(newValue) {
            const value = new Date(newValue.getFullYear(), newValue.getMonth() + 1, 0);
            if(value.getDate() != newValue.getDate()) {
                self.endDate(value);
                return;
            }
            self.calendar.endRange = value;

            if(self.calendar.startRange >= value) {
                self.startDate(new Date(newValue.getFullYear(), newValue.getMonth() - 1, 1));
                return;
            }

            self.refreshCalendar();
        });

        this.firstDow.subscribe(function(newValue) { 
            self.calendar.firstDow = newValue;
            self.refreshCalendar();
        });
    }

    refreshCalendar() {
        this.calendar.build();
        this.calendar.updateEvents();
    }

}
