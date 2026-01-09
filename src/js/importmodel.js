import { Modal } from "./modal.js";
import { EventReader } from './eventreader.js';

class UploadFile {
    file;
    name;

    constructor(parent, file) {
        this.file = file;
        this.parent = parent;

        this.name = ko.computed(function() {
            return file.name;
        });
    }
}

export class ImportModel extends Modal {
    calendar;
    fileInputElement;
    files;
    mode;
    subject;

    constructor(elementId, parent) {
        super(elementId);
        this.calendar = parent.calendar;

        this.fileInputElement = null;
        this.files = ko.observableArray([]);
        this.mode = ko.observable('ready');
        this.subject = ko.observable(null);
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

    beforeClose() {
        if(this.files().length !== 0) {
            return false;
        }
        return true;
    }



    cancelImport(file) {
        const index = this.files().findIndex(o => o === file);
        this.files.splice(index, 1);

        if(this.files().length === 0) {
            this.mode('ready');
        }
    }

    import(file) {

        this.mode('importing');
        this.subject(file);
        // const index = this.files().findIndex(o => o === file);
        // this.files.splice(index, 1);

    }

    onUpload(event) {
        if (!event || !event.target || !event.target.files) {
            return;
        }

        this.mode('uploading');
        for (let index = 0; index < event.target.files.length; index++) {
            const file = event.target.files[index];
            this.files.push(new UploadFile(this, file));
        }

        // const self = this;
        // const eventReader = new EventReader();
        // let promises = [];
        // for (let index = 0; index < event.target.files.length; index++) {
        //     const file = event.target.files[index];
        //     const promise = eventReader.readFile(file).then((events) => {
        //         events.forEach(event => {
        //             self.calendar.addEvent(event);
        //         });
        //     });
        //     promises.push(promise);
        // }

        // Promise.all(promises).then(() => {
        //     self.calendar.updateEvents();
        // });
    }
}
