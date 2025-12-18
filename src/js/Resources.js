
export class Resources {
    month_longnames;
    weekday_longnames;
    weekday_shortnames;
    weekday_letter;

    constructor() {
        this.month_longnames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        this.weekday_longnames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.weekday_shortnames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.weekday_letter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    }
}
