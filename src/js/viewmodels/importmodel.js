import { Modal } from "../modal.js";
import { CSVReader } from "../parsers/CSVReader.js";
import { ICSEventParser } from "../parsers/ICSParser.js";
import { LegacyJSONEventParser } from "../parsers/LegacyJSONEventParser.js";

class UploadFile {
    file;
    name;
    importas;
    importTypes;
    preview;

    constructor(parent, file) {
        const self = this;
        this.file = file;
        this.parent = parent;

        this.name = ko.computed(function() {
            return file.name;
        });

        const namedImportTypes = {
            'ics': { name: 'ICS', id: 'ics', types: ['text/calendar'], exts: ['.ics','.txt'], factory: (file) => new ICSEventParser(file) },
            'legacyjson': { name: 'Legacy Configuration', id: 'legacy', types: ['application/json'], exts: ['.json'], factory: (file) => new LegacyJSONEventParser(file) },
            //'modernjson': { name: 'Modern Configuration', id: 'modern', types: ['application/json'], exts: ['.json'], factory: (file) => { throw new Error('Not implemented'); } },
            'csv': { name: 'CSV', id: 'csv', types: [], exts: ['.csv'], factory: (file) => new CSVReader(file) }
        }
        this.importTypes = ko.computed(function() {
            const type = self.file.type;
            const fileparts = self.file.name.split('.');
            const ext = '.' + fileparts[fileparts.length - 1];
            const keys = Object.keys(namedImportTypes);

            let result = [];
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index];
                const importType = namedImportTypes[key];
                if(!result.includes(importType) && importType.types.includes(type)) {
                    result.push(importType);
                }
            }

            for (let index = 0; index < keys.length; index++) {
                const key = keys[index];
                const importType = namedImportTypes[key];
                if(!result.includes(importType) && importType.exts.includes(ext)) {
                    result.push(importType);
                }
            }

            if(result.length == 0) {

                console.log(type);
                return [
                    namedImportTypes['ics'],
                    namedImportTypes['csv']
                ];
            }

            return result;
        });
        this.importas = ko.observable(this.importTypes()[0]);
        this.preview = ko.observableArray([]);
    }

    mapObjs(o) {
        let result = Object.assign({}, o);

        if(!result.text) {
            result.text = 'Unknown';
        }

        if(!result.important) {
            result.important = false;
        }

        if(!result.date) {
            result.date = '####-01-01';
        }

        if(!result.color) {
            result.color = '#cccccc';
        }

        if(!result.icon) {
            result.icon = 'calendar';
        }

        return result;
    }

    load() {
        const self = this;
        const importas = this.importas();
        const parser = importas.factory(this.file);
        parser.read().then(data => {
            self.preview(data.map(o => self.mapObjs(o)));
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
        const mode = this.mode();
        if(mode === 'importing') {
            this.mode('uploading');
            this.subject(null);
        }
        
        const index = this.files().findIndex(o => o === file);
        this.files.splice(index, 1);

        if(this.files().length === 0) {
            this.mode('ready');
        }
    }

    applyData(file) {
        const events = file.preview();
        for (let index = 0; index < events.length; index++) {
            const event = events[index];
            this.calendar.addEvent(event);            
        }
        this.calendar.updateEvents();
        this.cancelImport(file);
    }

    import(file) {
        this.mode('importing');
        this.subject(file);
        file.load();
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

    }
}
