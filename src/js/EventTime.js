import { PartialDate } from "./PartialDate.js";

export class EventTime {
    datePattern;
    detail;
    hidden;
    uuid;

    color;
    icon;
    text;

    constructor(datePattern, detail) {
        this.datePattern = datePattern;
        this.detail = detail;
        this.uuid = crypto.randomUUID();
        this.hidden = ko.observable(false);

        const self = this;
        this.color = ko.computed(function() {
            return self.detail.color;
        });
        this.icon = ko.computed(function() {
            return self.detail.icon;
        });
        this.text = ko.computed(function() {
            return self.detail.text;
        });
    }

    match(date) {

        const left = PartialDate.parse(this.datePattern);
        const right = PartialDate.parse(date);

        return left.match(right);
    }

    serialize() {
        return {
            date: this.datePattern,
            text: this.detail.text,
            color: this.detail.color,
            icon: this.detail.icon
        };
    }
}
