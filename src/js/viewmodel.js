import { Calendar } from './calendar.js';
import { AddEventModel } from './addevent.js';
import { AllEventsModel } from './allevents.js';
import { SettingsModel } from './settings.js';
import { ImportModel } from './importmodel.js';
import { Sidebar } from './sidebar.js';

class ViewModel {
    calendar;
    addEvent;
    allEvents;
    settings;
    importModel;
    sidebar;

    constructor() {
        // TODO : Make configurable
        const currentYear = new Date().getFullYear();
        this.calendar = new Calendar(currentYear);
        this.addEvent = new AddEventModel('addEventModal', this);
        this.allEvents = new AllEventsModel('allEventsModal', this);
        this.settings = new SettingsModel('settingsModal', this);
        this.importModel = new ImportModel('importModal', this);
        this.sidebar = new Sidebar('sidebar');
    }

    init() {
        ko.applyBindings(this);
    }
}

var root = new ViewModel();
root.init();
