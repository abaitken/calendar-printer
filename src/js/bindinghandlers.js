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
        const value = ko.unwrap(valueAccessor());

        const text = (!value) ? '' : value.toISOString().split('T')[0];
        element.value = text;
    }
};

ko.bindingHandlers.fitHeight = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        const value = ko.unwrap(valueAccessor());
        element.classList.add(`fit${value}Height`);
    },
};

ko.bindingHandlers.strikethrough = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        const value = ko.unwrap(valueAccessor());
        if(value) {
            element.classList.add(`strikethrough`);
        } else {
            element.classList.remove(`strikethrough`);
        }
    },
    
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        const value = ko.unwrap(valueAccessor());
        if(value) {
            element.classList.add(`strikethrough`);
        } else {
            element.classList.remove(`strikethrough`);
        }
    },
};

ko.bindingHandlers.mdi = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {        
        element._previousValue = ko.unwrap(valueAccessor());
    },

    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        const value = ko.unwrap(valueAccessor());

        let icon = value;
        icon = icon.replace('#', '');
        if(element._previousValue) {
            element.classList.remove(`mdi-${element._previousValue}`);
        }
        element.classList.add(`mdi-${icon}`);
        element._previousValue = icon;
    }
};