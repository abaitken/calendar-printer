import { Modal } from "./modal.js";

export class ExportModel extends Modal {

    constructor(elementId, parent) {
        super(elementId);
        this.calendar = parent.calendar;
    }

}