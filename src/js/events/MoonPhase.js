import { EventDetail } from "../EventDetail.js";
import { EventTime } from "../EventTime.js";
import { EventSet } from "./EventSet.js";

const normalize = (value) => {
    value -= Math.floor(value);
    if (value < 0) value += 1;

    return value;
};

export class MoonPhase extends EventSet {
    referenceNewMoons;
    newMoonEventDetail;
    fullMoonEventDetail;
    firstQtrEventDetail;
    lastQtrEventDetail;

    constructor() {
        super('Moon Phase');

        this.referenceNewMoons = [
            new Date(Date.UTC(2000, 0, 6, 18, 14)),
            new Date(Date.UTC(2025, 11, 20)),
            new Date(Date.UTC(2026, 0, 18)),
        ];

        const color = '#d9c517ff';
        this.newMoonEventDetail = new EventDetail(color, 'moon-new', 'New Moon', false);
        this.fullMoonEventDetail = new EventDetail(color, 'moon-full', 'Full Moon', false);
        this.firstQtrEventDetail = new EventDetail(color, 'moon-first-quarter', 'First Quarter Moon', false);
        this.lastQtrEventDetail = new EventDetail(color, 'moon-last-quarter', 'Last Quarter Moon', false);
    }

    _findReferenceDate(date) {
        for (let index = 1; index < this.referenceNewMoons.length; index++) {
            const referenceDate = this.referenceNewMoons[index];
            if (referenceDate > date) {
                return this.referenceNewMoons[index - 1];
            }
        }
    }

    _getResolveEventDetail(date) {

        const SYNODIC_MONTH = 29.53058770576;

        const NEW_START = 27.68492597415;
        const NEW_EVENT = 29.53058770576; // 0
        const NEW_END = 1.84566173161;

        const FIRST_QTR_START = 5.53698519483;
        const FIRST_QTR_EVENT = 7.38264692644;
        const FIRST_QTR_END = 9.22830865805;

        const FULL_START = 12.91963212127;
        const FULL_EVENT = 14.76529385288;
        const FULL_END = 16.61095558449;

        const LAST_QTR_START = 20.30227904771;
        const LAST_QTR_EVENT = 22.14794077932;
        const LAST_QTR_END = 23.99360251093;

        const calcLunarAge = (date) => {
            // Based on jasonsturges/lunarphase-js 
            const time = date.getTime();
            const julianDate = time / 86400000 - date.getTimezoneOffset() / 1440 + 2440587.5;
            const lunarAgePercent = normalize((julianDate - 2451550.1) / SYNODIC_MONTH);
            const lunarAge = lunarAgePercent * SYNODIC_MONTH;
            return lunarAge;
        };
        const startOfDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        const endOfDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        const lunarEvent = (range, events) => {

            let ranges = [range];
            // Effectively the values will rollover
            // If the start is greater than the end, this indicates a rollover
            if (range[0] > range[1]) {
                // Create additional ranges with new boundaries
                ranges = [
                    [ 0, range[1] ],
                    [ range[0], SYNODIC_MONTH ]
                ];
            }

            for (let index = 0; index < ranges.length; index++) {
                const values = ranges[index];

                for (let index = 0; index < events.length; index++) {
                    const test = events[index];

                    // If the event falls within the range
                    if (test >= values[0] && test <= values[1]) {
                        return true;
                    }
                }
            }

            return false;
        };

        // Effectively workout whether the lunar event falls within the range of the current date
        const startOfDay = calcLunarAge(startOfDate(date));
        const endOfDay = calcLunarAge(endOfDate(date));
        if (lunarEvent([startOfDay, endOfDay], [0, NEW_EVENT])) return this.newMoonEventDetail;
        if (lunarEvent([startOfDay, endOfDay], [FIRST_QTR_EVENT])) return this.firstQtrEventDetail;
        if (lunarEvent([startOfDay, endOfDay], [FULL_EVENT])) return this.fullMoonEventDetail;
        if (lunarEvent([startOfDay, endOfDay], [LAST_QTR_EVENT])) return this.lastQtrEventDetail;

        return null;
    }

    get(filterPredicate) {
        if (this.hidden) {
            return [];
        }

        const filterObj = EventSet.resolveFilter(filterPredicate);

        if (Object.hasOwn(filterObj, 'important') && filterPredicate.important) {
            return [];
        }

        if (!Object.hasOwn(filterObj, 'date')) {
            return [];
        }

        if (!filterObj.date.isExact()) {
            return [];
        }

        const date = filterObj.date.toDate();
        const detail = this._getResolveEventDetail(date);

        if (detail) {
            return [
                new EventTime(date, detail)
            ];
        }

        return [];
    }

    records() {
        return [];
    }

    serialize() {
        return {
            type: 'MoonPhase',
            hidden: this.hidden
        };
    }
}
