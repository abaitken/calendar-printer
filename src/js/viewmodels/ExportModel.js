import { CSVExport } from "../export/CSVExport.js";
import { ICSExport } from "../export/ICSExport.js";
import { JSONExport } from "../export/JSONExport.js";
import { Modal } from "../modal.js";

export class ExportModel extends Modal {
    exportFormats;
    selectedFormat;

    constructor(elementId, parent) {
        super(elementId);
        this.calendar = parent.calendar;

        this.exportFormats = [
            { name: 'CSV', factory: () => new CSVExport() },
            { name: 'JSON', factory: () => new JSONExport() },
            { name: 'ICS', factory: () => new ICSExport() }
        ];

        this.selectedFormat = ko.observable(this.exportFormats[0]);
    }

    download() {
        const selectedFormat = this.selectedFormat();
        const format = selectedFormat.factory();
        format.export(this.calendar);
    }
}