export class SidebarModel {
    elementId;
    element;

    constructor(elementId) {
        if(!elementId) {
            throw new Error(`No elementId given`);
        }

        this.elementId = elementId;
    }

    getElement() {
        if(this.element) {
            return this.element;
        }

        this.element = document.getElementById(this.elementId);
        if(!this.element) {
            throw new Error(`Could not find element with id '${this.elementId}'`);
        }
        return this.element;
    }

    toggle() {
        if(this.getElement().classList.contains('sidebar-open')) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.getElement().classList.add('sidebar-open');
    }

    close() {
        this.getElement().classList.remove('sidebar-open');
    }
}