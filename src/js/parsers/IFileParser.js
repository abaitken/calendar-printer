export class IFileParser {
    file;

    constructor(file) {
        this.file = file;
    }

    parse(contents) {
        throw new Error('Not implemented');
    }

    read() {
        const self = this;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(self.parse(reader.result))
            };
            reader.onerror = reject;
            reader.readAsText(self.file);
        });
    }
}