import { EventSet } from "./EventSet.js";

export class MoonPhase extends EventSet {

    constructor() {
        super('Moon Phase');
    }

    get(filterPredicate) {
        if(this.hidden) {
            return [];
        }
        
        const filterObj = EventSet.resolveFilter(filterPredicate);

        if(Object.hasOwn(filterObj, 'important') && filterPredicate.important) {
            return [];
        }

        if(!Object.hasOwn(filterObj, 'date')) {
            return [];
        }

        return [];
    }

    records() {
        return [];
    }

    serialize() {
        return {
            type: 'MoonPhase'
        };
    }
}
