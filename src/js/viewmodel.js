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
    commands;
    modals;

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
        const modals = [
            this.confirmModel,
            this.iconSelector,
            this.datePatternBuilder,
            this.addEvent,
            this.allEvents,
            this.settings,
            this.importModel,
            this.aboutModel,
            this.exportModel
        ];
        const canExecuteCommand = () => modals.every(o => !o.state);
        const openModal = (model, custom) => (canExecuteCommand()) ? (!!custom) ? custom(model) : model.open() : () => {};
        this.commands = {
            'manage': () => openModal(this.allEvents),
            'import': () => openModal(this.importModel),
            'settings': () => openModal(this.settings),
            'export': () => openModal(this.exportModel),
            'about': () => openModal(this.aboutModel),
            'create': () => openModal(this.addEvent, (m) => m.createEvent()),
            'sidebar': () => (canExecuteCommand()) ? this.sidebar.toggle() : () => {}
        };
    }

    runCommand(name) {
        const command = this.commands[name];
        command();
    }

    init() {
        this.settings.restoreSettings();
        const storedEvents = new StorageEvents();
        const defaultEvents = new DefaultEvents();

        const events = (storedEvents.events.length != 0) ? storedEvents : defaultEvents;
        events.events.forEach(event => this.calendar.addEvent(event));

        this.calendar.build();
        this.calendar.updateEvents();

        ko.applyBindings(this);

        const self = this;
        document.addEventListener('keyup', (event) => {
            if(event.key === 'l') {
                self.runCommand('manage');
            }
            if(event.key === 'a') {
                self.runCommand('create');
            }
            if(event.key === 'm') {
                self.runCommand('sidebar');
            }
            if(event.key === 'h' || event.key === '?') {
                self.runCommand('about');
            }
        });
    }
}

var root = new ViewModel();
root.init();
