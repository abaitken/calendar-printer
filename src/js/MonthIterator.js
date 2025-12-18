export class MonthIterator {
    year;
    month;

    constructor(year, month) {
        this.year = year;
        this.month = month;
    }

    next() {
        this.month++;
        if (this.month > 11) {
            this.year++;
            this.month = 0;
        }
    }
}
