import { PartialDate } from "./PartialDate.js";

export class EventTime {
    datePattern;
    detail;
    hidden;
    uuid;

    constructor(datePattern, detail) {
        this.datePattern = datePattern;
        this.detail = detail;
        this.uuid = crypto.randomUUID();
        this.hidden = ko.observable(false);

        const self = this;
    }

    match(date) {

        const left = PartialDate.parse(this.datePattern);
        const right = PartialDate.parse(date);

        return left.match(right);
    }

    update(values) {
        this.detail.text(values.text);
        this.detail.color(values.color);
        this.detail.icon(values.icon);
        this.detail.important(values.important);
        this.datePattern = values.date;
    }

    serialize() {
        return {
            date: this.datePattern,
            text: this.detail.text(),
            color: this.detail.color(),
            icon: this.detail.icon(),
            important: this.detail.important()
        };
    }
}
