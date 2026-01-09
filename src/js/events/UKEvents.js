import { EventSetList } from "./EventSetList.js";
import { EventTime } from "../EventTime.js";
import { EventDetail } from "../EventDetail.js";

export class UKEvents extends EventSetList {

    constructor() {
        super('UK Events', [
            new EventTime("####-03-20", new EventDetail("#d35400", "#weather-sunny", "March Equinox", false)),
            new EventTime("####-06-21", new EventDetail("#d35400", "#weather-sunny", "June Solstice", false)),
            new EventTime("####-09-23", new EventDetail("#d35400", "#weather-sunny", "September Equinox", false)),
            new EventTime("####-12-22", new EventDetail("#d35400", "#weather-sunny", "December Solstice", false)),
            new EventTime("####-12-31", new EventDetail("violet", "#party-popper", "New Year's Eve", true)),
            new EventTime("####-01-01", new EventDetail("red", "#bank-off", "New Year's Day", true)),
            new EventTime("####-02-14", new EventDetail("red", "#heart", "Valentines Day", true)),
            new EventTime("####-10-31", new EventDetail("orange", "#halloween", "Halloween", true)),
            new EventTime("####-11-05", new EventDetail("orange", "#fire", "Bonfire Night / Guy Fawkes Day", false)),
            new EventTime("####-11-11", new EventDetail("red", "#flower-poppy", "Rememberance Day", true)),
            new EventTime("####-12-25", new EventDetail("green", "#gift", "Christmas Day", true)),
            new EventTime("####-12-26", new EventDetail("red", "#bank-off", "Boxing Day", true)),
            new EventTime("####-03-30", new EventDetail("black", "#clock-time-nine-outline", "Daylight Saving Time starts", true)),
            new EventTime("####-10-26", new EventDetail("black", "#clock-time-nine-outline", "Daylight Saving Time ends", true)),
            new EventTime("####-03-01", new EventDetail("gray", "#shield-cross", "St. David's Day (Wales)", false)),
            new EventTime("####-03-17", new EventDetail("gray", "#shield-cross", "St. Patrick's Day (NI)", false)),
            new EventTime("####-04-23", new EventDetail("gray", "#shield-cross", "St. George's Day (England)", false)),
            new EventTime("####-11-30", new EventDetail("gray", "#shield-cross", "St. Andrews day (Scotland)", false))
        ]);
    }

    serialize() {
        return {
            type: this.constructor.name
        };
    }
}