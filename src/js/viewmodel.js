import { Calendar } from './calendar.js';

class ViewModel {
    calendar;

    constructor() {
        // TODO : Make configurable
        const currentYear = new Date().getFullYear();
        this.calendar = new Calendar(currentYear);
    }

    uploadEvents() {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result )
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    onUpload(event) {
        if(!event || !event.target || !event.target.files) {
            return;
        }

        for (let index = 0; index < event.target.files.length; index++) {
            const file = event.target.files[index];
            this.readFile(file).then((contents) => {
        
                // TODO : Support different types based on file.type
                const data = JSON.parse(contents);
                
                for (let index = 0; index < data.dates.length; index++) {
                    const event = data.dates[index];
                    this.calendar.addEvent(event.date, event.text);
                }
            });
        }
    }

    init() {
        ko.applyBindings(this);

        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (event) => this.onUpload(event));
    }
}

var root = new ViewModel();
root.init();
