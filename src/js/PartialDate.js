export class PartialDate {
    static yearPartRegex = /(#{4}|\d{4})/;
    static monthPartRegex = /(#{1,2}|0?[1-9]|1[0-2])/;
    static dayPartRegex = /(#{1,2}|0?[1-9]|[12][0-9]|3[01]|MON|TUE|WED|THU|FRI|SAT|SUN|>>)/;

    year;
    month;
    day;

    constructor(year = null, month = null, day = null) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    isPartial() {
        return this.year === null || this.month === null || this.day === null;
    }

    isExact() {
        return !this.isPartial();
    }

    toDate() {
        if(!this.isExact()) {
            throw new Error('Cannot convert to exact date');
        }

        return new Date(Number.parseInt(this.year), Number.parseInt(this.month), Number.parseInt(this.day));
    }
    
    dow() {
        return PartialDate._getDowIndex(this.day);
    }

    static _getDowIndex(value) {
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

    match(other) {
        // TODO : Throw if other is not a PartialDate

        if (this.year !== null && this.year !== other.year) {
            return false;
        }

        if (this.month !== null && this.month !== other.month) {
            return false;
        }

        if (this.day === null || other.day === null) {
            return true;
        }

        if (this.day === other.day) {
            return true;
        }

        if (this.day === '>>') {
            const lastDayOfMonth = new Date(other.year, other.month + 1, 0);
            if (lastDayOfMonth.getDate() !== other.day) {
                return false;
            }
            return true;
        }

        const matchDow = PartialDate._getDowIndex(this.day);
        if (matchDow !== -1) {
            const date = new Date(other.year, other.month, other.day);
            if (date.getDay() !== matchDow) {
                return false;
            }
            return true;
        }

        return false;
    }
    

    static _parseYear(part) {
        if(part.length != 4) {
            throw new Error("Expected 4 characters denoting year");
        }
            
        if(part === '####') {
            return null;
        }

        if(/^\d{4}$/.test(part))
            return Number(part);
        
        throw new Error('Unable to parse year');
    }

    static _parseMonth(part) {
        if(part.length == 0 || part.length > 2) {
            throw new Error("Expected 2 characters denoting month");
        }
            
        if(part === '##' || part === '#') {
            return null;
        }

        if(/^\d{1,2}$/.test(part)) {
            return Number(part) - 1;
        }
        
        throw new Error('Unable to parse month');
    }

    static _parseDay(part) {
        if(part.length == 0 || part.length > 3) {
            throw new Error("Expected 2 or 3 characters denoting day");
        }
            
        if(part === '##' || part === '#') {
            return null;
        }
            
        if(part === '>>') {
            return '>>';
        }
            
        if(part === 'MON') {
            return 'MON';
        }
            
        if(part === 'TUE') {
            return 'TUE';
        }
            
        if(part === 'WED') {
            return 'WED';
        }
            
        if(part === 'THU') {
            return 'THU';
        }
            
        if(part === 'FRI') {
            return 'FRI';
        }
            
        if(part === 'SAT') {
            return 'SAT';
        }
            
        if(part === 'SUN') {
            return 'SUN';
        }

        if(/^\d{1,2}$/.test(part)) {
            return Number(part);
        }
        
        throw new Error('Unable to parse day');
    }

    static parse(pattern) {
        if(!pattern) {
            throw new Error('Expected date pattern');
        }

        if (pattern instanceof Date) {
            return new PartialDate(pattern.getFullYear(), pattern.getMonth(), pattern.getDate());
        }

        if (pattern instanceof PartialDate) {
            return pattern;
        }
        
        if (typeof pattern !== 'string') {
            throw new Error('Unexpected date pattern type');
        }

        const patternParts = pattern.split('-');

        if(patternParts > 3) {
            throw new Error('Unexpected date pattern format');
        }

        const year = PartialDate._parseYear(patternParts[0]);
        const month = (patternParts.length > 1 ) ? PartialDate._parseMonth(patternParts[1]) : null;
        const day = (patternParts.length > 2) ? PartialDate._parseDay(patternParts[2]) : null;

        return new PartialDate(year, month, day);
    }

    static validate(pattern) {
        const datePatternRegex = new RegExp(`^${PartialDate.yearPartRegex.source}-${PartialDate.monthPartRegex.source}-${PartialDate.dayPartRegex.source}$`);
        return datePatternRegex.test(pattern);
    }
}
