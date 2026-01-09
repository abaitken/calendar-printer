import { PartialDate } from "../PartialDate.js";

export class EventSet {
    name;
    hidden;

    constructor(name, hidden) {
        this.name = name;
        this.hidden = (hidden === undefined) ? false : hidden;
    }

    static resolveFilter(filterPredicate) {
        if(!filterPredicate) {
            throw new Error('Expected filter predicate, or object, or date, or PartialDate');
        }

        let result = {

        };

        if(typeof filterPredicate == 'function') {
            result.predicate = filterPredicate;
            return result;
        } else if(filterPredicate instanceof Date || typeof filterPredicate.getMonth === 'function') {
            result.date = PartialDate.parse(filterPredicate);
        } else if(filterPredicate instanceof PartialDate) {
            result.date = filterPredicate;
        } else if(typeof filterPredicate == 'object') {
            
            if(Object.hasOwn(filterPredicate, 'important') && filterPredicate.important) {
                result.important = filterPredicate.important;
            }

            if(Object.hasOwn(filterPredicate, 'date') && filterPredicate.date) {
                result.date = filterPredicate.date;
            }

            if(Object.hasOwn(filterPredicate, 'predicate') && filterPredicate.predicate) {
                result.predicate = filterPredicate.predicate;
            }
        }

        if(!result.predicate) {
            if(Object.hasOwn(result, 'important') && result.important) {
                result.predicate = e => e.detail.important() && e.match(result.date);
            } else {
                result.predicate = e => e.match(result.date);
            }
        }

        return result;
    }

    get(filterPredicate) {
        throw new Error('get is not implemented');
    }

    records() {
        throw new Error('records is not implemented');
    }

    serialize() {
        throw new Error('serialize is not implemented');
    }
}
