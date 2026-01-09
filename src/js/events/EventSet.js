export class EventSet {
    name;
    hidden;

    constructor(name, hidden) {
        this.name = name;
        this.hidden = (hidden === undefined) ? false : hidden;
    }

    get(filterPredicate) {
        throw new Error('get is not implemented');
    }

    serialize() {
        throw new Error('serialize is not implemented');
    }
}
