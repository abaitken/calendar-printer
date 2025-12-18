export class Week {
    days;

    constructor(calendar, month) {
        this.days = [];
    }

    updateEvents(eventCalendar) {
        this.days.filter(d => !!d).forEach(day => {
            day.updateEvents(eventCalendar);
        });
    }
}
