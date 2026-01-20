import { IFileParser } from "./IFileParser.js";

export class LegacyJSONEventParser extends IFileParser {
    constructor(file) {
        super(file);
    }

    parse(contents) {
        const data = JSON.parse(contents);

        // TODO : Get event styles
        // icon:
        // color:
        let result = data.dates.map(item => {
            return {
                date: item.date,
                text: item.text
            };
        });
        return result;
    }
}
