export class SidebarModel {
    element;

    constructor(elementId) {
        if(!elementId) {
            throw new Error(`No elementId given`);
        }

        this.element = document.getElementById(elementId);
        if(!this.element) {
            throw new Error(`Could not find element with id '${elementId}'`);
        }
    }

    open() {
        this.element.classList.add('sidebar-open');
    }

    close() {
        this.element.classList.remove('sidebar-open');
    }
}