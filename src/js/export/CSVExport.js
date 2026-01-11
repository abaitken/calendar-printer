import { EventSetList } from "../events/EventSetList.js";
import { ExportFormat } from "./ExportFormat.js";

class CSVWriter {
    buffer;

    constructor() {
        this.buffer = '';
    }

    formatValue(value) {
        if(typeof value === 'number') {
            return `${value}`;
        }

        return `"${value}"`;
    }

    writeValues(values) {
        let record = '';

        for (let index = 0; index < values.length; index++) {
            const value = values[index];
            
            if(record.length != 0) {
                record += ',';
            }

            record += this.formatValue(value);
        }

        this.buffer += record + '\n';
    }
}

export class CSVExport extends ExportFormat {
    export(calendar) {
        let writer = new CSVWriter();

        writer.writeValues([
            "Event Set",
            "Event Name",
            "Date Pattern",
            "Color",
            "Icon",
            "Hidden",
            "Important"
        ]);

        const eventSets = calendar.events.eventSets();
        for (let index = 0; index < eventSets.length; index++) {
            const eventSet = eventSets[index];

            if(!(eventSet instanceof EventSetList)) {
                continue;
            }

            if(eventSet.events.length === 0) {
                continue;
            }

            for (let index = 0; index < eventSet.events.length; index++) {
                const event = eventSet.events[index];

                let values = [];
                values.push(eventSet.name);

                values.push(event.detail.text());
                values.push(event.datePattern);
                values.push(event.detail.color());
                values.push(event.detail.icon());
                values.push(event.hidden());
                values.push(event.detail.important());
            
                writer.writeValues(values);

            }
        }

        const filename = 'events.csv';
        const blobData = new Blob([writer.buffer], { type: 'text/plain' });

        const anchorElement = document.createElement("a");
        const fileUrl = URL.createObjectURL(blobData);

        anchorElement.href = fileUrl;
        anchorElement.download = filename;
        document.body.appendChild(anchorElement);

        anchorElement.addEventListener('click', function(e) {
            setTimeout(() => {
                document.body.removeChild(anchorElement);
                URL.revokeObjectURL(fileUrl);
            }, 0);
        }, { once: true });

        anchorElement.click();

    }
}