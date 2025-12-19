import { Modal } from "./modal.js";

export class IconSelectorModel extends Modal {
    icons;
    onPickedCallback;
    selectedIcon;
    color;

    constructor(elementId) {
        super(elementId);
        this.icons = ko.observableArray([]);
        this.selectedIcon = ko.observable('#calendar');
        this.color = ko.observable('gray');
    }

    open(onPickedCallback, selectedIcon, color) {
        super.open();
        this.onPickedCallback = onPickedCallback;
        this.selectedIcon(selectedIcon);
        this.color(color);
    }

    accept() {
        this.onPickedCallback(this.selectedIcon());
        this.close();
    }

    cancel() {
        this.close();
    }

    afterClose() {
        this.onPickedCallback = null;
    }

    beforeOpen() {
        let icons = [
            '#none',
            '#cake-variant',
            '#halloween',
            '#meteor',
            '#moon-full',
            '#moon-new',
            '#shield-cross',
            '#bank-off',
            '#gift',
            '#calendar',
            '#clock-time-nine-outline',
            '#heart',
            '#earth',
            '#weather-sunny',
            '#flower-poppy',
            '#fire',
            '#party-popper',
            '#egg-easter',
            '#pencil-box',
            '#delete'
        ];
        this.icons(icons);
    }

    select(value) {
        this.selectedIcon(value);
    }
}
