import { Modal } from "./modal.js";

export class ConfirmModel extends Modal {
    content;
    resolve;
    reject;

    constructor(elementId, parent) {
        super(elementId);
        this.content = ko.observable('');

        this.resolve = null;
        this.reject = null;
    }

    confirm(text) {
        this.content(text);
        this.open();
        let self = this;
        return new Promise((resolve, reject) => {
            self.resolve = resolve;
            self.reject = reject;
        });
    }

    accept() {
        this.close();
        this.resolve();

        this.resolve = null;
        this.reject = null;
    }

    cancel() {
        this.close();
        this.reject();

        this.resolve = null;
        this.reject = null;
    }
}
