import { Calendar } from './calendar.js';
import { EventReader } from './eventreader.js';

class Modal {
    element;

    constructor(elementId) {
        this.element = document.getElementById(elementId);
    }

    onopened() { }
    onclosed() { }

    open() {
        this.element.classList.add('modal-open');
        this.onopened();
    }

    close() {
        this.element.classList.remove('modal-open');
        this.onclosed();
    }
}

class AddModal extends Modal {    
    constructor(elementId, parent) {
        super(elementId);
    }

    addEvent() {
        this.close();
    }

    cancelAddEvent() {
        this.close();
    }
}

class ViewModel {
    calendar;
    addModal;

    constructor() {
        // TODO : Make configurable
        const currentYear = new Date().getFullYear();
        this.calendar = new Calendar(currentYear);
        this.addModal = new AddModal('addEventModal', this);
    }

    openEventAddModal() {
        this.addModal.open();
    }

    openSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.add('sidebar-open');
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('sidebar-open');
    }

    clearEvents() {
        this.calendar.clearEvents();
        this.calendar.updateEvents();
    }

    uploadEvents() {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
    }

    onUpload(event) {
        if (!event || !event.target || !event.target.files) {
            return;
        }

        const self = this;
        const eventReader = new EventReader();
        let promises = [];
        for (let index = 0; index < event.target.files.length; index++) {
            const file = event.target.files[index];
            const promise = eventReader.readFile(file).then((events) => {
                events.forEach(event => {
                    self.calendar.addEvent(event);
                });
            });
            promises.push(promise);
        }

        Promise.all(promises).then(() => {
            self.calendar.updateEvents();
        });

    }

    init() {
        ko.applyBindings(this);

        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (event) => this.onUpload(event));
    }
}

var root = new ViewModel();
root.init();
