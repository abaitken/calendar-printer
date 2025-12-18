export class RangeIterator {
    startRange;
    endRange;
    currentDate;

    constructor(startRange, endRange) {
        this.startRange = startRange;
        this.endRange = endRange;
        this.currentDate = startRange;
    }

    current() {
        if (this.currentDate > this.endRange) {
            return null;
        }
        return this.currentDate;
    }

    nextMonth() {
        let year = this.currentDate.getFullYear();
        let month = this.currentDate.getMonth();
        let day = this.currentDate.getDate();

        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        this.currentDate = new Date(year, month, day);

        return this.current();
    }
}
