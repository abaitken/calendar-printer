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
import { DatePatternBuilder } from './DatePatternBuilder.js';
import { StorageEvents } from './StorageEvents.js';
import { ConfirmModel } from './ConfirmModel.js';

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
    datePatternBuilder;
    confirmModel;

    constructor() {
        const currentYear = new Date().getFullYear();
        this.calendar = new Calendar(new Date(currentYear, 0, 1), new Date(currentYear, 11, 31));
        
        this.confirmModel = new ConfirmModel('confirmModal', this);
        this.iconSelector = new IconSelectorModel('iconSelectorModal');
        this.datePatternBuilder = new DatePatternBuilder('datePatternBuilderModal', this);
        this.addEvent = new AddEventModel('addEventModal', this);
        this.allEvents = new AllEventsModel('allEventsModal', this);
        this.settings = new SettingsModel('settingsModal', this);
        this.importModel = new ImportModel('importModal', this);
        this.sidebar = new SidebarModel('sidebar');
        this.aboutModel = new Modal('aboutModal');
        this.exportModel = new ExportModel('exportModal', this);
    }

    init() {
        const storedEvents = new StorageEvents();
        const defaultEvents = new DefaultEvents();

        const events = (storedEvents.events.length != 0) ? storedEvents : defaultEvents;
        events.events.forEach(event => this.calendar.addEvent(event));

        this.calendar.build();
        this.calendar.updateEvents();

        ko.applyBindings(this);
    }
}

var root = new ViewModel();
root.init();
