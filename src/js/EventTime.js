export class EventTime {
    datePattern;
    detail;
    uuid;

    constructor(datePattern, detail) {
        this.datePattern = datePattern;
        this.detail = detail;
        this.uuid = crypto.randomUUID();
    }

    getDowIndex(value) {
        switch (value) {
            case 'MON':
                return 1;
            case 'TUE':
                return 2;
            case 'WED':
                return 3;
            case 'THU':
                return 4;
            case 'FRI':
                return 5;
            case 'SAT':
                return 6;
            case 'SUN':
                return 0;

            default:
                return -1;
        }
    }

    match(date) {
        const patternParts = this.datePattern.split('-');
        const matchYear = patternParts[0];
        const matchMonth = patternParts[1];
        const matchDay = (patternParts.length > 2) ? patternParts[2] : null;

        let year = 0;
        let month = 0;
        let day = 0;

        if (typeof date === 'string') {
            const subjectParts = date.split('-');
            year = Number(subjectParts[0]);
            month = Number(subjectParts[1]);
            day = (subjectParts.length > 2) ? Number(subjectParts[2]) : null;
        }

        if (typeof date === 'object') {
            year = date.getFullYear();
            month = date.getMonth();
            day = date.getDate();
        }

        if (matchYear !== '####' && Number(matchYear) !== year) {
            return false;
        }

        if (matchMonth !== '##' && Number(matchMonth) !== month + 1) {
            return false;
        }

        if (!day) {
            return true;
        }

        if (matchDay === '##') {
            return true;
        }

        if (matchDay === '>>') {
            const lastDayOfMonth = new Date(year, month + 1, 0);
            if (lastDayOfMonth.getDate() !== day) {
                return false;
            }
            return true;
        }

        if (Number(matchDay) === day) {
            return true;
        }

        const matchDow = this.getDowIndex(matchDay);
        if (matchDow !== -1) {
            //const date = new Date(year, month, day);
            if (date.getDay() !== matchDow) {
                return false;
            }
            return true;
        }

        return false;
    }
}
