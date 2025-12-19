
export class Modal {
    elementId;
    element;

    constructor(elementId) {
        if(!elementId) {
            throw new Error(`No elementId given`);
        }

        this.elementId = elementId;
        this.element = document.getElementById(this.elementId);
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

    beforeOpen() { }
    beforeClose() {
        return true;
    }
    afterOpen() { }
    afterClose() { }

    open() {
        this.beforeOpen();
        this.getElement().classList.add('modal-open');
        this.afterOpen();
    }

    close() {
        if(!this.beforeClose()) {
            return;
        }
        this.getElement().classList.remove('modal-open');
        this.afterClose();
    }
}
