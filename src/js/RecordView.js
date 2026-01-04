class Heading {
    direction;
    sortFn;
    name;
    sortable;
    resetting;

    constructor(parent, options) {
        this.sortFn = (options.sort) ? options.sort : (l, r) => {
            const lv = l[options.key];
            const rv = r[options.key];

            if(typeof lv === 'number') {
                return lv - rv;
            }

            if(typeof lv === 'string') {
                return lv.localeCompare(rv);
            }
            return 0;
        };
        this.name = options.name;
        const self = this;
        const keys = Object.keys(options);
        this.sortable = (keys.includes('sortable') && !options.sortable) ? false : true,
        this.direction = ko.observable(0);
        this.direction.subscribe(function(){
            if(self.resetting) {
                return;
            }
            parent.onSort(self);
        });
        this.resetting = false;
    }

    getNewDirection(current) {
        switch(current) {
            case 0:
                return 1;
            case 1:
                return -1;
            case -1:
                return 0;
        }

        return 0;
    }

    changeDirection() {
        this.direction(this.getNewDirection(this.direction()));
    }

    reset() {
        this.resetting = true;
        this.direction(0);
        this.resetting = false;
    }
}

export class RecordView {
    recordData;
    page;
    recordsPerPage;
    fetchRecordsFn;
    records;
    pageSizes;
    pageNumber;
    totalPages;
    totalRecords;
    eventRouter;
    filterFn;
    headings;


        // this.sort = {
        //     'text': new SortModel(this, (l, r) => { }),
        //     'important': new SortModel(this, (l, r) => { }),
        //     'pattern': new SortModel(this, (l, r) => { }),
        //     'color': new SortModel(this, (l, r) => { })
        // };
        // const keys = Object.keys(this.sort);
        //     (l, r) => {
        //         if(keys.every(o => self.sort[o].direction() === 0)) {
        //             return 0;
        //         }

        //         return 0;
        //     }

    constructor(fetchRecordsFn, eventRouter, filterFn, headings) {
        this.fetchRecordsFn = fetchRecordsFn;
        this.eventRouter = eventRouter;
        this.filterFn = filterFn;
        this.headings = headings.map(o => new Heading(this, o));
        this.recordData = ko.observableArray(fetchRecordsFn());
        this.page = ko.observable(0);
        this.recordsPerPage = ko.observable(10);
        this.pageSizes = [10, 25, 50, 75, 100];

        const self = this;

        this.sortedRecords = ko.computed(function() {
            let recordData = self.recordData();
            const sortOn = self.headings.filter(o => o.direction() != 0);
            if(sortOn.length != 0 && sortOn[0].sortFn != null) {
                recordData = [...recordData].sort((l, r) => sortOn[0].sortFn(l, r) * sortOn[0].direction());
            }
            return recordData;
        });

        this.filteredRecords = ko.computed(function() {
            const recordData = self.sortedRecords()
                .filter(o => self.filterFn(o));
            return recordData;
        });

        this.records = ko.computed(function () {
            const recordData = self.filteredRecords();
            const page = self.page();
            const recordsPerPage = self.recordsPerPage();

            const startIndex = page * recordsPerPage;
            const endIndex = startIndex + recordsPerPage;
            const result = recordData.slice(startIndex, endIndex);
            return result;
        });

        this.pageNumber = ko.computed(function () {
            return self.page() + 1;
        });

        this.totalRecords = ko.computed(function () {
            return self.filteredRecords().length;
        });

        this.totalPages = ko.computed(function () {
            return Math.ceil(self.totalRecords() / self.recordsPerPage());
        });
    }

    calculateLastPage(recordCount, recordsPerPage) {
        if (recordCount === 0) {
            return 0;
        }
        const lastPage = Math.floor(recordCount / recordsPerPage);
        return lastPage;
    }

    firstPage() {
        this.page(0);
    }

    nextPage() {
        const currentPage = this.page();
        const lastPage = this.calculateLastPage(this.totalRecords(), this.recordsPerPage());

        if (currentPage === lastPage) {
            return;
        }
        this.page(currentPage + 1);
    }

    previousPage() {
        const currentPage = this.page();
        if (currentPage == 0) {
            return;
        }
        this.page(currentPage - 1);
    }

    lastPage() {
        this.page(this.calculateLastPage(this.totalRecords(), this.recordsPerPage()));
    }

    onSort(heading) {
        const previousSort = this.headings.filter(o => o.direction() != 0 && o != heading);
        if(previousSort.length !== 0) {
            previousSort[0].reset();
        }
        this.refresh();
    }

    refresh() {
        this.recordData(this.fetchRecordsFn());

        const totalRecords = this.totalRecords();
        if (totalRecords === 0) {
            this.firstPage();
        }

        const page = this.page();
        const recordsPerPage = this.recordsPerPage();
        const startIndex = page * recordsPerPage;

        if (startIndex > totalRecords) {
            const lastPage = this.calculateLastPage(totalRecords, recordsPerPage);
            this.page(lastPage);
        }
    }

    route(eventName, item) {
        if (this.eventRouter) {
            this.eventRouter(eventName, item);
        }
    }
}
