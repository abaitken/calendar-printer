
export class Modal {
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

    onopened() { }
    onclosed() { }

    open() {
        this.element.classList.add('modal-open');
        this.onopened();
    }

    close() {
        this.element.classList.remove('modal-open');
        this.onclosed();
    }
}
