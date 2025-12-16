import { Calendar } from './calendar.js';

class ViewModel {
    calendar;

    constructor() {
        const currentYear = new Date().getFullYear();
        this.calendar = new Calendar(currentYear);
    }

    Init() {
        ko.applyBindings(this);
    }
}

var root = new ViewModel();
root.Init();
