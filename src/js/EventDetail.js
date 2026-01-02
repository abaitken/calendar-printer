export class EventDetail {
    color;
    icon;
    text;
    important;

    constructor(color, icon, text, important) {
        this.color = ko.observable(color);
        this.icon = ko.observable(icon);
        this.text = ko.observable(text);
        this.important = ko.observable(important);
    }
}
