$.widget("ui.catcomplete", $.ui.autocomplete, {
    _renderMenu: function (ul, items) {
        var that = this, categories = {};
        // Sort by category.
        $.each(items, function (index, item) {
            if (!!item.category) {
                if (!categories[item.category]) {
                    categories[item.category] = [];
                }
                categories[item.category].push(item);
            } else {
                that._renderItemData(ul, item);
            }
        });

        $.each(categories, function (categoryName, items) {
            ul.append("<li class='ui-autocomplete-category'>" + categoryName + "</li>");

            $.each(items, function (index, item) {
                that._renderItemData(ul, item);
            });
        });
    }
});