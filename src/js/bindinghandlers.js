ko.bindingHandlers.applyClasses = {
    update: function (element, valueAccessor) {
        const params = ko.unwrap(valueAccessor());
        const condition = ko.unwrap(params.condition);
        const classNames = params.classNames;
        if(!classNames) {
            throw new Error('Expected classNames property');
        }

        if(condition) {
            element.classList.add(classNames);
        } else {
            element.classList.remove(classNames);
        }
    }
};

ko.bindingHandlers.includeHtml = {
    init: function (element, valueAccessor) {
        const url = ko.unwrap(valueAccessor());
        fetch(url)
            .then(response => response.text())
            .then(html => {
                element.innerHTML = html;
                
                //ko.applyBindings(ko.contextFor(element), element);
                Array.from(element.children).forEach(child => {
                    ko.applyBindings(ko.contextFor(element), child);
                });

            })
            .catch(err => {
                element.innerHTML = "<span style='color:red'>Error loading file</span>";
                console.error("Failed to load HTML:", err);
            });
    }
};

ko.bindingHandlers.datePicker = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        ko.utils.registerEventHandler(element, "change", function () {
            const value = valueAccessor();
            value(new Date(element.value));
        });
    },

    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        const value = valueAccessor();

        const text = value().toISOString().split('T')[0];
        element.value = text;
    }
};
