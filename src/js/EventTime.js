import { PartialDate } from "./PartialDate.js";

export class EventTime {
    datePattern;
    detail;
    uuid;

    constructor(datePattern, detail) {
        this.datePattern = datePattern;
        this.detail = detail;
        this.uuid = crypto.randomUUID();
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
