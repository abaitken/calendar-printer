//import { jsPDF } from "jspdf";
//import { jsPDF } from "../bower_components/jspdf/dist/jspdf.es.min.js";
//import "../bower_components/jspdf/dist/polyfills.es.js";
//import { jsPDF } from "../bower_components/jspdf/dist/jspdf.umd.min.js";

import { Month } from "./Month.js";
import { RangeIterator } from "./RangeIterator.js";

const cellWidth = 30;
const cellHeight = 25;
const headerHeight = 10;
const topMargin = 10;
const leftMargin = 10;
const rightMargin = leftMargin;

const pageTitleSize = 16;
const weekdayTextSize = 12;
const dayNumberTextSize = 12;

export class PDFGenerator {
    _generateMonth(doc, calendar, month, weekdays) {

        const viewWidth = doc.internal.pageSize.getWidth();
        const cellWidth = (viewWidth - leftMargin - rightMargin) / weekdays.length;
        let x = leftMargin;
        let y = topMargin;
        

        doc.setFontSize(pageTitleSize);
        doc.setFont(undefined, 'bold');
        doc.text(x, y, month.title);
        //y += doc.getLineHeight(month.title);
        y += 16;

        // const data = month.weeks.map(week => {
        //     let result = {};
        //     for (let index = 0; index < weekdays.length; index++) {
        //         const weekday = weekdays[index];
        //         const day = week.days[index];
        //         result[weekday.name] = (day) ? day.text : '';
        //     }
        //     return result;
        // });
        // doc.table(x, y, data, weekdays.map(o => o.name));

        const tableLeft = leftMargin;

        doc.setFontSize(weekdayTextSize);
        doc.setFont(undefined, 'bold');

        // Header
        for (let index = 0; index < weekdays.length; index++) {
            const weekday = weekdays[index];
            doc.cell(x, y, cellWidth, headerHeight, weekday.name, 0, 'center');

            x += cellWidth;
        }
        y += headerHeight;

        doc.setFontSize(dayNumberTextSize);
        doc.setFont(undefined, 'bold');

        // Weeks
        for (let weekIndex = 0; weekIndex < month.weeks.length; weekIndex++) {
            const week = month.weeks[weekIndex];

            x = tableLeft;
            
            for (let index = 0; index < week.days.length; index++) {
                const day = week.days[index];
                
                if(day) {
                    doc.cell(x, y, cellWidth, cellHeight, `${day.text}
line1
line2
line3
line4`, weekIndex + 1, 'left');
                } else {
                    doc.cell(x, y, cellWidth, cellHeight, '', weekIndex + 1, 'left');
                }

                x += cellWidth;
            }

            y += cellHeight;
        }
    }

    generate(calendar) {
        const doc = new jspdf.jsPDF({
            orientation: "landscape",
        });

        doc.setFont('courier');

        const weekdays = calendar.createWeekdayArray(calendar.firstDow);

        let iterator = new RangeIterator(calendar.startRange, calendar.endRange);
        let current = iterator.current();

        while(current) {
            const month = new Month(calendar, current.getFullYear(), current.getMonth());
            this._generateMonth(doc, calendar, month, weekdays);
            current = iterator.nextMonth();
            if(current) {
                doc.addPage();
            }
        }

        doc.save("test.pdf");
    }
}
