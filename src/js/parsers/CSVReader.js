import { IFileParser } from "./IFileParser.js";
import { LineIterator } from "./LineIterator.js";


export class CSVReader extends IFileParser {
    constructor(file) {
        super(file);
    }

    getValues(line) {
        let results = [''];

        let inQuotedValue = false;
        for (let index = 0; index < line.length; index++) {
            const c = line[index];
            
            if(inQuotedValue && c === '"') {
                inQuotedValue = false;
                continue
            }
            if(!inQuotedValue && c === '"') {
                inQuotedValue = true;
                continue;
            }
            if(!inQuotedValue && c === ',') {
                results.push('');
                continue;
            }
            if(c === '\n' || c === '\r') {
                continue;
            }
            results[results.length - 1] += c;
        }

        return results;
    }
    parse(contents) {
        let results = [];

        // TODO : Replace LineIterator with a proper parser which can support multi line CSV values
        const lines = new LineIterator(contents);
        let header = this.getValues(lines.next());

        let line = lines.next();
        while(line) {
            const values = this.getValues(line);

            let item = {};
            for (let index = 0; index < header.length; index++) {
                const col = header[index];
                item[col] = values[index];
            }
            results.push(item);

            line = lines.next();
        }

        return results;
    }
}
