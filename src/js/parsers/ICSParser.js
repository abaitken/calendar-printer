import { IFileParser } from "./IFileParser.js";
import { LineIterator } from "./LineIterator.js";

export class ICSEventParser extends IFileParser {
    constructor(file) {
        super(file);
    }
    
    parse(contents) {
        let results = [];
        
        const states = {
            seekStartEvent: 0,
            seekEndEvent: 1
        };
        const startRegex = /^BEGIN:VEVENT\s*$/;
        const endRegex = /^END:VEVENT$/;
        const textRegex = /^SUMMARY:(?<value>.+?)\s*$/;
        const dateStartRegex = /^DTSTART;VALUE=DATE:(?<value>.+?)\s*$/;

        const lines = new LineIterator(contents);
        let line = lines.next();
        let state = states.seekStartEvent;
        let event = null;

        while(line) {
            line = lines.next();

            if(state === states.seekStartEvent) {
                if(startRegex.test(line)) {
                    state = states.seekEndEvent;
                    event = {};
                }

                continue;
            }

            if(state === states.seekEndEvent) {
                if(endRegex.test(line)) {
                    state = states.seekStartEvent;
                    results.push(event);
                    event = null;
                }

                const textMatch = line.match(textRegex);
                if(textMatch) {
                    let text = textMatch.groups.value;
                    text = text.replace(/\\(.)/g, "$1");
                    event.text = text;
                    continue;
                }

                const dateMatch = line.match(dateStartRegex);
                if(dateMatch) {
                    const date = dateMatch.groups.value;
                    event.date = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`;
                    continue;
                }

                continue;
            }
        }

        return results;
    }
}
