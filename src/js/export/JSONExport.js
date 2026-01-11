import { ExportFormat } from "./ExportFormat.js";

export class JSONExport extends ExportFormat {
    export(calendar) {
        throw new Error('export must be implemented');
    }
}