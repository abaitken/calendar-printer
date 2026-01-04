import { Modal } from "./modal.js";

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
        const storeObj = {
            startDate: this.calendar.startRange,
            endDate: this.calendar.endRange,
            firstDow: this.calendar.firstDow,
            showNextMonthsEventSummary: this.calendar.showNextMonthsEventSummary()
        };
        window.localStorage.setItem('settings', JSON.stringify(storeObj));
    }

    restoreSettings() {
        const settingsData = window.localStorage.getItem('settings');
        if(!settingsData) {
            return;
        }
        const settings = JSON.parse(settingsData);
        //this.calendar.startRange = settings.startDate;
        //this.calendar.endRange = settings.endDate;
        this.calendar.firstDow = settings.firstDow;
        this.calendar.showNextMonthsEventSummary(settings.showNextMonthsEventSummary);
    }
}
