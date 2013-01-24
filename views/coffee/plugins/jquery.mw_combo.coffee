(($) ->
  $.widget "ui.combobox",
    _create: ->
      input = undefined
      self = this
      select = @element.hide()
      selected = select.children(":selected")
      value = (if selected.val() then selected.text() else "")
      wrapper = $("<span>").addClass("ui_combobox").insertAfter(select)
      input = $("<input>").attr("tabindex", $(select).attr("tabindex")).appendTo(wrapper).val(value).autocomplete(
        delay: 0
        minLength: 0
        source: (request, response) ->
          matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i")
          response select.children("option").map(->
            text = $(this).text()
            if @value and (not request.term or matcher.test(text))
              label: text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(request.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "$1")
              value: text
              option: this
          )

        select: (event, ui) ->
          ui.item.option.selected = true
          self._trigger "selected", event,
            item: ui.item.option

        change: (event, ui) ->
          unless ui.item
            matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i")
            valid = false
            select.children("option").each ->
              if $(this).text().match(matcher)
                @selected = valid = true
                false

            unless valid
              # remove invalid value, as it didn't match anything
              $(this).val ""
              select.val ""
              input.data("autocomplete").term = ""
              false
      )

      $("<a>").attr("tabIndex", -1).attr("title", "Show Available Items").addClass("combo_trigger").appendTo(wrapper).button(text: false).click ->

        # close if already visible
        if input.autocomplete("widget").is(":visible")
          input.autocomplete "close"
          return

        # work around a bug (likely same cause as #5265)
        $(this).blur()

        # pass empty string as value to search for, displaying all results
        input.autocomplete "search", ""
        input.focus()


    destroy: ->
      @wrapper.remove()
      @element.show()
      $.Widget::destroy.call this

) jQuery
