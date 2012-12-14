// Generated by CoffeeScript 1.4.0

(function($) {
  return $.widget("ui.combobox", {
    _create: function() {
      var input, select, selected, self, value, wrapper;
      input = void 0;
      self = this;
      select = this.element.hide();
      selected = select.children(":selected");
      value = (selected.val() ? selected.text() : "");
      wrapper = $("<span>").addClass("ui_combobox").insertAfter(select);
      input = $("<input>").attr("tabindex", $(select).attr("tabindex")).appendTo(wrapper).val(value).autocomplete({
        delay: 0,
        minLength: 0,
        source: function(request, response) {
          var matcher;
          matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
          return response(select.children("option").map(function() {
            var text;
            text = $(this).text();
            if (this.value && (!request.term || matcher.test(text))) {
              return {
                label: text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(request.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
                value: text,
                option: this
              };
            }
          }));
        },
        select: function(event, ui) {
          ui.item.option.selected = true;
          return self._trigger("selected", event, {
            item: ui.item.option
          });
        },
        change: function(event, ui) {
          var matcher, valid;
          if (!ui.item) {
            matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i");
            valid = false;
            select.children("option").each(function() {
              if ($(this).text().match(matcher)) {
                this.selected = valid = true;
                return false;
              }
            });
            if (!valid) {
              $(this).val("");
              select.val("");
              input.data("autocomplete").term = "";
              return false;
            }
          }
        }
      });
      input.data("autocomplete")._renderItem = function(ul, item) {
        return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul);
      };
      return $("<a>").attr("tabIndex", -1).attr("title", "Show Available Items").addClass("combo_trigger").appendTo(wrapper).button({
        text: false
      }).click(function() {
        if (input.autocomplete("widget").is(":visible")) {
          input.autocomplete("close");
          return;
        }
        $(this).blur();
        input.autocomplete("search", "");
        return input.focus();
      });
    },
    destroy: function() {
      this.wrapper.remove();
      this.element.show();
      return $.Widget.prototype.destroy.call(this);
    }
  });
})(jQuery);
