import { Calendar } from './calendar.js';
import { AddEventModel } from './addevent.js';
import { AllEventsModel } from './allevents.js';
import { SettingsModel } from './settings.js';
import { ImportModel } from './importmodel.js';

class ViewModel {
    calendar;
    addEvent;
    allEvents;
    settings;
    importModel;

    constructor() {
        // TODO : Make configurable
        const currentYear = new Date().getFullYear();
        this.calendar = new Calendar(currentYear);
        this.addEvent = new AddEventModel('addEventModal', this);
        this.allEvents = new AllEventsModel('allEventsModal', this);
        this.settings = new SettingsModel('settingsModal', this);
        this.importModel = new ImportModel('importModal', this);
    }

    openSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.add('sidebar-open');
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('sidebar-open');
    }

    init() {
        ko.applyBindings(this);
    }
}

var root = new ViewModel();
root.init();
