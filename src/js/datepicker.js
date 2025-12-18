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
