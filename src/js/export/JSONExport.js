import { ExportFormat } from "./ExportFormat.js";

export class JSONExport extends ExportFormat {
    export(calendar) {
        let obj = {
            eventsets: []
        };

        const eventSets = calendar.events.eventSets();
        for (let index = 0; index < eventSets.length; index++) {
            const eventSet = eventSets[index];

            obj.eventsets.push(eventSet.serialize());
        }

        obj.settings = calendar.serialize();

        this.download(JSON.stringify(obj), 'events.json', 'text/plain');
    }
}