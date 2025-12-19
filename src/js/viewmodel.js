import { Calendar } from './calendar.js';
import { AddEventModel } from './AddEventModel.js';
import { AllEventsModel } from './AllEventsModel.js';
import { SettingsModel } from './SettingsModel.js';
import { ImportModel } from './importmodel.js';
import { SidebarModel } from './SidebarModel.js';
import { DefaultEvents } from './defaultevents.js';
import { Modal } from './modal.js';
import { ExportModel } from './ExportModel.js';
import { IconSelectorModel } from './IconSelectorModel.js';

class ViewModel {
    calendar;
    addEvent;
    allEvents;
    settings;
    importModel;
    sidebar;
    aboutModel;
    exportModel;
    iconSelector;

    constructor() {
        const currentYear = new Date().getFullYear();
        this.calendar = new Calendar(new Date(currentYear, 0, 1), new Date(currentYear, 11, 31));

        const defaultEvents = new DefaultEvents();
        defaultEvents.events.forEach(event => this.calendar.addEvent(event));

        this.calendar.build();
        this.calendar.updateEvents();
        
        this.iconSelector = new IconSelectorModel('iconSelectorModal');
        this.addEvent = new AddEventModel('addEventModal', this);
        this.allEvents = new AllEventsModel('allEventsModal', this);
        this.settings = new SettingsModel('settingsModal', this);
        this.importModel = new ImportModel('importModal', this);
        this.sidebar = new SidebarModel('sidebar');
        this.aboutModel = new Modal('aboutModal');
        this.exportModel = new ExportModel('exportModal', this);
    }

    init() {
        ko.applyBindings(this);
    }
}

var root = new ViewModel();
root.init();
