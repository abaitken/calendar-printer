export class WeekDayIterator {
    dow;

    constructor(start) {
        this.dow = start;
    }

    next() {
        this.dow++;
        if (this.dow > 6) {
            this.dow = 0;
        }
    }
}
