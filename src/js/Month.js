import { Day } from "./Day.js";
import { MonthIterator } from "./MonthIterator.js";
import { Week } from "./Week.js";
import { WeekDayIterator } from "./WeekDayIterator.js";

export class Month {
    year;
    month;
    index;
    title;
    weeks;
    nextMonthEvents;

    constructor(calendar, year, month) {
        this.year = year;
        this.month = month + 1;
        this.index = month;
        this.title = calendar.getMonthName(this.index) + ' ' + year;

        let weeks = [];

        const daysInMonth = new Date(year, this.index + 1, 0).getDate();

        let dayNumber = 1;

        let day = new Day(calendar, this, dayNumber);
        let week = new Week(calendar, this);

        // Pad start of first week
        let dowIterator = new WeekDayIterator(calendar.weekdays[0].nativeIndex);
        while (day.dow !== dowIterator.dow) {
            week.days.push(null);
            dowIterator.next();
        }

        week.days.push(day);
        dayNumber++;

        // Iterate days and add to current week
        while (dayNumber <= daysInMonth) {
            // Rotate week when it is full
            if (week.days.length >= 7) {
                weeks.push(week);
                week = new Week(calendar, this);
            }

            day = new Day(calendar, this, dayNumber);
            week.days.push(day);
            dayNumber++;
        }

        // Pad last week
        while (week.days.length < 7) {
            week.days.push(null);
        }
        weeks.push(week);

        this.weeks = weeks;
        this.nextMonthEvents = ko.observableArray([]);
    }

    updateEvents(eventCalendar) {
        this.weeks.forEach(week => {
            week.updateEvents(eventCalendar);

            let monthIterator = new MonthIterator(this.year, this.index);
            monthIterator.next();
            this.nextMonthEvents(eventCalendar.getMonthlyEventSummary(monthIterator.year, monthIterator.month));
        });
    }
}
