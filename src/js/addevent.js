import { Modal } from './modal.js';

export class AddEventModel extends Modal {    
    constructor(elementId, parent) {
        super(elementId);
    }

    addEvent() {
        this.close();
    }

    cancelAddEvent() {
        this.close();
    }
}
