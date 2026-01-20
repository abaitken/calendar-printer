import { Modal } from "../modal.js";
import { StorageManager } from "../StorageManager.js";

export class SettingsModel extends Modal {
    calendar;
    startDate;
    endDate;
    firstDow;
    dows;
    showNextMonthsEventSummary;
    
    constructor(elementId, parent) {
        super(elementId);
        const self = this;
        this.calendar = parent.calendar;
        this.startDate = ko.observable(this.calendar.startRange);
        this.endDate = ko.observable(this.calendar.endRange);
        this.firstDow = ko.observable(this.calendar.firstDow);
        this.dows = this.calendar.createWeekdayArray(0);
        this.showNextMonthsEventSummary = ko.computed({
            read: () => self.calendar.showNextMonthsEventSummary(),
            write: (value) => { self.calendar.showNextMonthsEventSummary(value); self.saveSettings(); }
        });

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
        this.saveSettings();
        this.calendar.build();
        this.calendar.updateEvents();
    }

    saveSettings() {
        const storeObj = this.calendar.serialize();

        const storage = new StorageManager();
        storage.store('settings', storeObj);
    }

    restoreSettings() {
        const storage = new StorageManager();
        const settings = storage.fetch('settings');

        if(!settings) {
            return;
        }
        
        //this.calendar.startRange = settings.startDate;
        //this.calendar.endRange = settings.endDate;

        if(settings.firstDow !== undefined) {
            this.calendar.firstDow = settings.firstDow;
        }

        if(settings.showNextMonthsEventSummary !== undefined) {
            this.calendar.showNextMonthsEventSummary(settings.showNextMonthsEventSummary);
        }
    }
}
