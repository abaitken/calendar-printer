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
