import { ExportFormat } from "./ExportFormat.js";

export class CSVExport extends ExportFormat {
    export(calendar) {
        throw new Error('export must be implemented');
    }
}