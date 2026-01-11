import { ExportFormat } from "./ExportFormat.js";

export class ICSExport extends ExportFormat {
    export(calendar) {
        throw new Error('export must be implemented');
    }
}