export class LineIterator {
    value;
    currentIndex;
    nextIndex;

    constructor(value) {
        this.value = value;
        this.currentIndex = -1;
        this.nextIndex = 0;
    }

    current() {
        if (this.currentIndex === -1) {
            throw new Error('next() must be called');
        }

        if (this.nextIndex === -1) {
            return this.value.slice(this.currentIndex);
        }

        let result = this.value.slice(this.currentIndex, this.nextIndex);
        result = result.replace(/\r*$/, '');
        return result;
    }

    next() {
        if (this.nextIndex === -1) {
            return null;
        }

        if (this.currentIndex === -1) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = this.nextIndex + 1;
        }

        this.nextIndex = this.value.indexOf('\n', this.currentIndex);
        return this.current();
    }
}
