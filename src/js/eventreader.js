class IEventParser {
    parse(contents) {
        throw new Error("Not implemented");
    }
}

class JSONEventParser extends IEventParser {
    constructor() {
        super();
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

class LineIterator {
    value;
    currentIndex;
    nextIndex;

    constructor(value) {
        this.value = value;
        this.currentIndex = -1;
        this.nextIndex = 0;
    }

    current() {
        if(this.currentIndex === -1) {
            throw new Error('next() must be called');
        }

        if(this.nextIndex === -1) {
            return this.value.slice(this.currentIndex);
        }

        let result = this.value.slice(this.currentIndex, this.nextIndex);
        result = result.replace(/\r*$/, '');
        return result;
    }

    next() {
        if(this.nextIndex === -1) {
            return null;
        }

        if(this.currentIndex === -1) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = this.nextIndex + 1;
        }
        
        this.nextIndex = this.value.indexOf('\n', this.currentIndex);
        return this.current();
    }
}

class ICSEventParser extends IEventParser {
    constructor() {
        super();
    }
    
    parse(contents) {
        let result = [];
        
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
                    result.push(event);
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

        return result;
    }
}

export class EventReader {

    createParser(type) {
        switch (type) {
            case 'text/calendar':
                return new ICSEventParser();
            case 'application/json':
                return new JSONEventParser();
        
            default:
                return null;
        }
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            
            const parser = this.createParser(file.type);

            if(!parser) {
                throw new Error(`No parser available for file type '${file.type}'`)
            }

            const reader = new FileReader();
            reader.onload = () => {
                resolve(parser.parse(reader.result))
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }


}