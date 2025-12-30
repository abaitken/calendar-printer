export class EventDetail {
    color;
    icon;
    text;

    constructor(color, icon, text) {
        this.color = ko.observable(color);
        this.icon = ko.observable(icon);
        this.text = ko.observable(text);
    }
}
