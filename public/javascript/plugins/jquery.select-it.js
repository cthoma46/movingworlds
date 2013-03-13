/*
 * jQuery UI Select-it!
 *
 * @version v1.0
 *
 * Copyright 2013, MovingWorlds
 * Released under the MIT license.
 */
(function ($) {

    $.widget('ui.selectit', {
        options: {
            itemName: 'item',
            fieldName: 'tags',
            availableTags: [],
            tagSource: null,
            caseSensitive: false,
            minChars: 2, // tags must have at least 2 chars
            placeholder: 'enter multiple values',

            selectFieldNode: null,

            tabIndex: null,

            // Event callbacks.
            onTagAdded: null,
            onTagRemoved: null,
            onTagClicked: null
        },


        _create: function () {
            var that = this;

            // Throw error on anything that isn't a select.
            if (!this.element.is('select')) {
                throw new Error("ui.selectit only works on <select multiple> tags");
            }

            // Setup our select node.
            this.options.selectFieldNode = this.element;
            this.element.css('display', 'none');

            // Setup our control container
            this._controlContainer = $("<div/>").insertAfter(this.element);
            this._controlContainer.addClass('selectit ui-widget ui-widget-content ui-corner-left ui-combobox');

            // Extract the data
            this.options.availableTags = this._readDataFromSelect(this.element);

            this._tagInput = $('<input type="text">').addClass('ui-widget-content');
            this._tagInput.attr('tabindex', this.element.attr('tabIndex') || this.options.tabIndex);
            this._tagInput.attr('placeholder', this.element.attr('placeholder' || this.options.placeholder));

            // Create the tag list and input.
            this.tagList = $('<ul></ul>');
            this._controlContainer.append(this.tagList);
            this.tagList
                .append($('<li class="selectit-new"></li>').append(this._tagInput))
                .click(function (e) {
                    var target = $(e.target);
                    if (target.hasClass('selectit-label')) {
                        that._trigger('onTagClicked', e, target.closest('.selectit-choice'));
                    } else {
                        // Sets the focus() to the input field, if the user
                        // clicks anywhere inside the UL. This is needed
                        // because the input field needs to be of a small size.
                        that._tagInput.focus();
                    }
                });

            // Add existing tags from the select field.
            var tagValues = [];
            this.options.selectFieldNode.find('option[selected]').each(function (i, tag) {
                that.createTag($(tag).val(), $(tag).html());
            });

            // Autocomplete.
            this._tagInput.catcomplete({
                source: this.options.availableTags,
                minLength: 0,
                select: function (event, ui) {
                    // Delete the last tag if we autocomplete something despite the input being empty
                    // This happens because the input's blur event causes the tag to be created when
                    // the user clicks an autocomplete item.
                    // The only artifact of this is that while the user holds down the mouse button
                    // on the selected autocomplete item, a tag is shown with the pre-autocompleted text,
                    // and is changed to the autocompleted text upon mouseup.

                    if (that._tagInput.val() === '') {
                        that.removeTag(that._lastTag(), false);
                    }

                    if (that._isNew(ui.item.value, ui.item.label)) {
                        that.createTag(ui.item.value, ui.item.label);
                    }

                    // Preventing the tag input to be updated with the chosen value.
                    return false;
                },
                focus: function (event, ui) {
                    that._tagInput.val(ui.item.label);
                    return false;
                }
            });

            // Autocomplete button.
            var wasOpen = false;
            this._comboButton = $("<a>")
                .attr("tabIndex", -1)
                .attr("title", "Show Available Items")
                .addClass( "ui-corner-right ui-combobox-toggle" )
                .appendTo(this._controlContainer)
                .mousedown(function() {
                    wasOpen = that._tagInput.catcomplete( "widget" ).is( ":visible" );
                })
                .click(function() {
                    that._tagInput.focus();

                    // close if already visible
                    if ( wasOpen ) {
                        return;
                    }

                    // pass empty string as value to search for, displaying all results
                    that._tagInput.catcomplete( "search", "" );
                });

            // Events.
            this._tagInput
                .keydown(function (event) {
                    var inputLabel = that._cleanedInput(), inputLen = inputLabel.length, inputValue = that._valueForLabel(inputLabel);

                    // Comma/Space/Enter are all valid delimiters for new tags,
                    // Tab will also create a tag, unless the tag input is empty, in which case it isn't caught.

                    switch (event.which) {
                        // Backspace not detected in a keypress, so it must be keydown.
                        case $.ui.keyCode.BACKSPACE:
                            if (inputLen == 0) {
                                var tag = that._lastTag();
                                that.removeTag(tag);
                                return;
                            }
                            break;
                        // Comma/Space/Tab are all valid delimiters for new tags, so check to see if something's available.
                        case $.ui.keyCode.COMMA:
                        case $.ui.keyCode.ENTER:
                        case $.ui.keyCode.TAB:
                            event.preventDefault();
                            if (inputLen && inputValue && that._isNew(inputValue)) {
                                that.createTag(inputValue, inputLabel);
                            }
                            that._tagInput.catcomplete('close');

                    }
                }).blur(function (e) {
                    // Create a tag when the element loses focus (unless it's empty).
                    var inputLabel = that._cleanedInput(), inputLen = inputLabel.length, inputValue = that._valueForLabel(inputLabel);
                    if (inputLen && inputValue && that._isNew(inputValue)) {
                        that.createTag(inputValue, inputLabel);
                    }
                });
        },

        _cleanedInput: function () {
            // Returns the contents of the tag input, cleaned and ready to be passed to createTag
            return $.trim(this._tagInput.val().replace(/^"(.*)"$/, '$1'));
        },

        _valueForLabel: function (label) {
            var value = '';
            $.each(this.options.availableTags, function (i, val) {
                if (val.label == label) {
                    value = val.value;
                    return false;
                }
            });
            return value;
        },

        _isNew: function (value) {
            var values = this.options.selectFieldNode.val();
            return (value && (values == null || values.indexOf(value) == -1));
        },

        _labelForValue: function (value) {
            var label = '';
            $.each(this.options.availableTags, function (i, val) {
                if (val.value == value) {
                    label = val.label;
                    return false;
                }
            });
            return label;
        },

        _lastTag: function () {
            return this.tagList.children('.selectit-choice:last');
        },

        createTag: function (value, tagLabel) {
            that = this;
            // Automatically trims the value of leading and trailing whitespace.
            value = $.trim(value);

            if (!tagLabel) {
                // Always try to find a label if we don't have one.
                tagLabel = that._labelForValue(value);
            }

            that.options.selectFieldNode.find("option[value='" + value + "']").attr('selected', true);

            var label = $(this.options.onTagClicked ? '<a class="selectit-label"></a>' : '<span class="selectit-label"></span>').text(tagLabel);

            // Create tag.
            var tag = $('<li></li>')
                .addClass('selectit-choice ui-widget-content ui-state-default ui-corner-all')
                .append(label);
            tag.data('value', value);

            // Button for removing the tag.
            var removeTagIcon = $('<span></span>')
                .addClass('ui-icon ui-icon-close');
            var removeTag = $('<a><span class="text-icon">\xd7</span></a>') // \xd7 is an X
                .addClass('close')
                .append(removeTagIcon)
                .click(function (e) {
                    // Removes a tag when the little 'x' is clicked.
                    that.removeTag(tag);
                });
            tag.append(removeTag);

            // Unless options.singleField is set, each tag has a hidden input field inline.
            var tags = this.options.selectFieldNode.val();
            tags.push(value);

            this._trigger('onTagAdded', null, tag);

            // Cleaning the input.
            this._tagInput.val('');

            // insert tag
            this._tagInput.parent().before(tag);
        },

        removeTag: function (tag) {
            tag = $(tag);

            var val = tag.data('value');
            that.options.selectFieldNode.find("option[value='" + val + "']").attr('selected', false);

            this._trigger('onTagRemoved', null, tag);

            tag.remove();
        },

        removeAll: function () {
            var that = this;
            this.tagList.children('.selectit-choice').each(function (index, tag) {
                that.removeTag(tag, false);
            });
        },


        _readDataFromSelect: function (element) {
            var dataList = element.children();
            var data = [];

            function iterate(index, tag, category) {
                var $tag = $(tag);
                if (tag.nodeName == 'OPTGROUP') {
                    var category = $tag.attr('label');

                    $(tag).children().each(function (index, tag) {
                        iterate(index, tag, category);
                    });
                } else {
                    data.push({
                        "category": category,
                        "label": $tag.html(),
                        "value": $tag.attr('value')
                    })
                }
            };
            dataList.each(function (index, tag) {
                iterate(index, tag);
            });

            return data;
        },

    });

})(jQuery);