import { Modal } from "./modal.js";

export class IconSelectorModel extends Modal {
    icons;
    onPickedCallback;
    selectedIcon;
    color;

    constructor(elementId) {
        super(elementId);
        this.icons = ko.observableArray([]);
        this.selectedIcon = ko.observable('calendar');
        this.color = ko.observable('gray');
    }

    openPicker(onPickedCallback, selectedIcon, color) {
        super.open();
        this.onPickedCallback = onPickedCallback;
        this.selectedIcon(selectedIcon.replace('#', ''));
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
        if(this.icons().length != 0) {
            return;
        }

        // fetch("bower_components/mdi/css/materialdesignicons.css")
        // .then(r => r.text())
        // .then(css => { 
        //     const matches = css.match(/\.mdi-[a-z0-9-]+/g); 
        //     const unique = [...new Set(matches)].map(x => x.substring(1) /* Remove dot */);
        //     return unique;
        // })
        // .then(icons => {
        //     const values = icons.map(o => o.substring(4) /* Remove mdi- */);
        //     this.icons(values);
        // });

        let icons = [
            'none',
            'cake-variant',
            'halloween',
            'meteor',
            'moon-full',
            'moon-new',
            'shield-cross',
            'bank-off',
            'gift',
            'calendar',
            'clock-time-nine-outline',
            'heart',
            'earth',
            'weather-sunny',
            'flower-poppy',
            'fire',
            'party-popper',
            'egg-easter',
            'pencil-box',
            'delete'
        ];
        this.icons(icons);
    }

    select(value) {
        this.selectedIcon(value);
    }
}
