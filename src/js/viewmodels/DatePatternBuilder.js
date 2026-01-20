import { PartialDate } from "../PartialDate.js";
import { Modal } from "../modal.js";
import { Resources } from "../Resources.js";

export class DatePatternBuilder extends Modal {
    onAcceptCallback;
    pattern;

    dows;
    months;

    specificDate;
    specificYear;
    everyYear;
    specificMonth;
    everyMonth;
    specificDay;
    everyDay;
    lastDayOfMonth;
    dow;
    updating;

    constructor(elementId, parent) {
        super(elementId);
        const self = this;
        this.pattern = ko.observable('');

        this.dows = parent.calendar.createWeekdayArray(0);
        const resources = new Resources();
        let months = [];
        for (let index = 0; index < 12; index++) {
            months.push({
                name: resources.month_longnames[index],
                nativeIndex: index
            });
        }

        this.months = months;

        this.specificDate = ko.observable(parent.calendar.startRange);

        this.specificYear = ko.observable(parent.calendar.startRange.getFullYear());
        this.everyYear = ko.observable(true);
        this.specificMonth = ko.observable();
        this.everyMonth = ko.observable(true);
        this.specificDay = ko.observable(1);
        this.everyDay = ko.observable(false);
        this.lastDayOfMonth = ko.observable(false);
        this.dow = ko.observable(parent.calendar.firstDow);
        this.updating = false;
        
        this.pattern.subscribe((pattern) => self._updateFromPattern(pattern));

        this.specificDate.subscribe((newValue) => self._updateFromDate(newValue));
        
        this.specificYear.subscribe(() => self._updateFromValue());
        this.everyYear.subscribe(() => self._updateFromValue());
        this.specificMonth.subscribe(() => self._updateFromValue());
        this.everyMonth.subscribe(() => self._updateFromValue());
        this.specificDay.subscribe(() => self._updateFromValue());
        this.everyDay.subscribe(() => self._updateFromValue());
        this.lastDayOfMonth.subscribe(() => self._updateFromValue());
        this.dow.subscribe(() => self._updateFromValue());
    }

    _updateFromDate(newValue) {
        if(!(this instanceof DatePatternBuilder)) {
            return;
        }

        if(this.updating) {
            return;
        }

        this.updating = true;

        this.everyYear(false);
        this.everyMonth(false);
        this.everyDay(false);

        this.specificYear(newValue.getFullYear());
        this.specificMonth(newValue.getMonth());
        this.specificDay(newValue.getDate());

        this.updating = false;
        this._updateFromValue();
    }

    _updateFromValue() {
        if(!(this instanceof DatePatternBuilder)) {
            return;
        }

        if(this.updating) {
            return;
        }

        this.updating = true;

        let yearPart = '####';
        let monthPart = '##';
        let dayPart = '##';

        if(!this.everyYear()) {
            yearPart = this.specificYear();
        }

        if(!this.everyMonth()) {
            monthPart = (this.specificMonth() + 1);
        }

        if(this.lastDayOfMonth()) {
            dayPart = '>>';
        } else if(!this.everyDay()) {
            dayPart = this.specificDay();
        }

        this.pattern(`${yearPart}-${monthPart}-${dayPart}`);

        this.updating = false;
    }

    _updateFromPattern(pattern) {
        if(!(this instanceof DatePatternBuilder)) {
            return;
        }

        if(this.updating) {
            return;
        }

        this.updating = true;

        if(!PartialDate.validate(pattern)) {
            this.updating = false;
            return;
        }

        const partialDate = PartialDate.parse(pattern);
        this.everyYear(partialDate.year === null);
        this.everyMonth(partialDate.month === null);
        this.everyDay(partialDate.day === null);

        if(!this.everyYear()) {
            this.specificYear(partialDate.year);
        }

        if(!this.everyMonth()) {
            this.specificMonth(partialDate.month);
        }

        if(!this.everyDay()) {
            this.lastDayOfMonth(partialDate.day === '>>');
            const dow = partialDate.dow();
            if(dow !== -1) this.dow(dow);
            if(dow === -1) this.specificDay(partialDate.day);
        }

        this.updating = false;
    }

    open(onAcceptCallback, pattern) {
        super.open();
        this.onAcceptCallback = onAcceptCallback;
        if(!pattern || pattern.length == 0) {
            pattern = '####-01-01';
        }
        this.pattern(pattern);
    }

    accept() {
        this.onAcceptCallback(this.pattern());
        this.close();
    }

    cancel() {
        this.close();
    }

    afterClose() {
        this.onAcceptCallback = null;
    }

    beforeOpen() {
    }
}
