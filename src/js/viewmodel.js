import { Calendar } from './calendar.js';
import { AddEventModel } from './AddEventModel.js';
import { AllEventsModel } from './AllEventsModel.js';
import { SettingsModel } from './SettingsModel.js';
import { ImportModel } from './importmodel.js';
import { SidebarModel } from './SidebarModel.js';
import { Modal } from './modal.js';
import { ExportModel } from './ExportModel.js';
import { IconSelectorModel } from './IconSelectorModel.js';
import { DatePatternBuilder } from './DatePatternBuilder.js';
import { Persistence } from './events/Persistence.js';
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
        const openModal = (model, custom) => { 
            if(!canExecuteCommand()) {
                return false;
            }
            if (!!custom) {
                custom(model);
            } else {
                model.open();
            }
            return true;
        };
        this.commands = {
            'manage': { action: () => openModal(this.allEvents), shortcuts: ['l'] },
            'import': { action: () => openModal(this.importModel), shortcuts: ['i'] },
            'settings': { action: () => openModal(this.settings), shortcuts: ['s'] },
            'export': { action: () => openModal(this.exportModel), shortcuts: ['e', 'x'] },
            'about': { action: () => openModal(this.aboutModel), shortcuts: ['?', 'h'] },
            'create': {action: (e) => {
                if(!canExecuteCommand()) {
                    return false;
                }   
                if(e) {
                    this.addEvent.createEvent(e);
                } else {
                    this.addEvent.createEvent();
                }
                return true;
            }, shortcuts: ['a'] },
            'sidebar': { action: () => {
                if(!canExecuteCommand()) {
                    return false;
                }
                this.sidebar.toggle();
                return true;
            }, shortcuts: ['m'] },
            'print': { action: () => { 
                if(!canExecuteCommand()) {
                    return false;
                }
                window.print(); 
                return true; 
            }, shortcuts: ['p']}
        };
    }

    runCommand(name, e) {
        const command = this.commands[name];
        let action = command;
        if(typeof action === 'object') {
            action = command.action;
        }
        return action(e);
    }

    init() {
        this.settings.restoreSettings();
        const storedEvents = new Persistence();
        storedEvents.restore(this.calendar);
        this.calendar.build();
        this.calendar.updateEvents();

        ko.applyBindings(this);

        const self = this;
        document.addEventListener('keyup', (event) => {
            if(event.ctrlKey || event.altKey) {
                return false;
            }
            const keys = Object.keys(self.commands);
            for (let index = 0; index < keys.length; index++) {
                const command = self.commands[keys[index]];
                
                if(command.shortcuts && command.shortcuts.includes(event.key)) {
                    return self.runCommand(keys[index]);
                }
            }
            return false;
        });
    }
}

var root = new ViewModel();
root.init();
