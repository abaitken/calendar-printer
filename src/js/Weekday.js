export class Weekday {
    nativeIndex;
    name;

    constructor(nativeIndex, resources) {
        this.nativeIndex = nativeIndex;
        this.name = resources.weekday_longnames[nativeIndex];
    }
}
