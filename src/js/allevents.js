import { Modal } from './modal.js';

class RecordView {
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
        this.recordsPerPage = ko.observable(25);
        this.pageSizes = [25, 50, 75, 100];

        const self = this;

        this.records = ko.computed(function () {
            const recordData = self.recordData();
            const page = self.page();
            const recordsPerPage = self.recordsPerPage();

            const startIndex = page * recordsPerPage;
            const endIndex = startIndex + recordsPerPage + 1;
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

export class AllEventsModel extends Modal {
    events;
    updateTrigger;
    calendar;

    constructor(elementId, parent) {
        super(elementId);
        this.calendar = parent.calendar;
        this.events = new RecordView(() => this.getRecords(), (eventName, record) => this.handleRecordEvent(eventName, record));
        this.calendar.addEventListener('updateEvents', e => {
            this.events.refresh();
        });
    }

    getRecords() {
        const eventCalendar = this.calendar.events;
        return eventCalendar.events;
    }

    handleRecordEvent(eventName, record) {
        if(eventName === 'edit') {
            return this.editRecord(record);
        }
        if(eventName === 'delete') {
            return this.deleteRecord(record);
        }
    }

    editRecord(record) {
        console.log('edit');
        console.log(record);
    }

    deleteRecord(item) {
        this.calendar.events.remove(item);
        this.calendar.updateEvents(); // TODO : This is the wrong place to do this... it should be responsive from the EventCalendar itself
    }
}
