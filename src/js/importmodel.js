import { Modal } from "./modal.js";
import { EventReader } from './eventreader.js';

export class ImportModel extends Modal {
    calendar;
    
    constructor(elementId, parent) {
        super(elementId);
        this.calendar = parent.calendar;

        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (event) => this.onUpload(event));
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
}
