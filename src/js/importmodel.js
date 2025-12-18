import { Modal } from "./modal.js";
import { EventReader } from './eventreader.js';

export class ImportModel extends Modal {
    calendar;
    fileInputElement;

    constructor(elementId, parent) {
        super(elementId);
        this.calendar = parent.calendar;

        this.fileInputElement = null;
    }

    getFileInputElement() {
        if (this.fileInputElement) {
            return this.fileInputElement;
        }

        this.fileInputElement = document.getElementById('fileInput');

        if (this.fileInputElement) {
            this.fileInputElement.addEventListener('change', (event) => this.onUpload(event));
        }

        return this.fileInputElement;
    }

    uploadEvents() {
        const fileInput = this.getFileInputElement();
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
}
