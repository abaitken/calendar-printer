
export class Modal {
    element;

    constructor(elementId) {
        this.element = document.getElementById(elementId);
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
