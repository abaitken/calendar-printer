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

    constructor(fetchRecordsFn, eventRouter) {
        this.fetchRecordsFn = fetchRecordsFn;
        this.eventRouter = eventRouter;
        this.recordData = ko.observableArray(fetchRecordsFn());
        this.page = ko.observable(0);
        this.recordsPerPage = ko.observable(10);
        this.pageSizes = [10, 25, 50, 75, 100];

        const self = this;

        this.records = ko.computed(function () {
            const recordData = self.recordData();
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
            return self.recordData().length;
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

    refresh() {
        const records = this.fetchRecordsFn();

        this.recordData(records);

        if (records.length === 0) {
            this.firstPage();
        }

        const page = this.page();
        const recordsPerPage = this.recordsPerPage();
        const startIndex = page * recordsPerPage;

        if (startIndex > records.length) {
            const lastPage = calculateLastPage(records.length, recordsPerPage);
            this.page(lastPage);
        }
    }

    route(eventName, item) {
        if (this.eventRouter) {
            this.eventRouter(eventName, item);
        }
    }
}
