#
#* jQuery UI Tag-it!
#*
#* @version v2.0 (06/2011)
#*
#* Copyright 2011, Levy Carneiro Jr.
#* Released under the MIT license.
#* http://aehlke.github.com/tag-it/LICENSE
#*
#* Homepage:
#*   http://aehlke.github.com/tag-it/
#*
#* Authors:
#*   Levy Carneiro Jr.
#*   Martin Rehfeld
#*   Tobias Schmidt
#*   Skylar Challand
#*   Alex Ehlke
#*
#* Maintainer:
#*   Alex Ehlke - Twitter: @aehlke
#*
#* Dependencies:
#*   jQuery v1.4+
#*   jQuery UI v1.8+
#
(($) ->
  $.widget "ui.tagit",
    options:
      itemName: "item"
      fieldName: "tags"
      availableTags: []
      tagSource: null
      removeConfirmation: false
      caseSensitive: true
      minChars: 2 # tags must have at least 2 chars
      selectionLimit: 50 # max of 5 tags per product
      placeholderText: "enter multiple values"
      
      # When enabled, quotes are not neccesary
      # for inputting multi-word tags.
      allowSpaces: true
      
      # The below options are for using a single field instead of several
      # for our form values.
      #
      # When enabled, will use a single hidden field for the form,
      # rather than one per tag. It will delimit tags in the field
      # with singleFieldDelimiter.
      #
      # The easiest way to use singleField is to just instantiate tag-it
      # on an INPUT element, in which case singleField is automatically
      # set to true, and singleFieldNode is set to that element. This 
      # way, you don't need to fiddle with these options.
      singleField: false
      singleFieldDelimiter: ","
      
      # Set this to an input DOM node to use an existing form field.
      # Any text in it will be erased on init. But it will be
      # populated with the text of tags as they are created,
      # delimited by singleFieldDelimiter.
      #
      # If this is not set, we create an input node for it,
      # with the name given in settings.fieldName, 
      # ignoring settings.itemName.
      singleFieldNode: null
      
      # Optionally set a tabindex attribute on the input that gets
      # created for tag-it.
      tabIndex: null
      
      # Event callbacks.
      onTagAdded: null
      onTagRemoved: null
      onTagClicked: null

    _create: ->
      
      # for handling static scoping inside callbacks
      that = this
      @options.selectionLimit = @element.data("max")  if @element.data("max")
      
      # There are 2 kinds of DOM nodes this widget can be instantiated on:
      #     1. UL, OL, or some element containing either of these.
      #     2. INPUT, in which case 'singleField' is overridden to true,
      #        a UL is created and the INPUT is hidden.
      if @element.is("input")
        @tagList = $("<ul></ul>").insertAfter(@element)
        @options.singleField = true
        @options.singleFieldNode = @element
        @element.css "display", "none"
      else
        @tagList = @element.find("ul, ol").andSelf().last()
      @_tagInput = $("<input type=\"text\">").addClass("ui-widget-content")
      @_tagInput.attr "tabindex", @element.attr("tabIndex") or @options.tabIndex
      @_tagInput.attr "placeholder", @element.attr("placeholder" or @options.placeholderText)
      @_tagInput.attr "tagSource", @element.data("source") or @options.tagSource
      
      # this.options.selectionLimit = this.element.data('max') || this.options.selectionLimit );
      @options.tagSource = @options.tagSource or (search, showChoices) ->
        filter = search.term.toLowerCase()
        choices = $.grep(that.options.availableTags, (element) ->
          
          # Only match autocomplete options that begin with the search term.
          # (Case insensitive.)
          element.toLowerCase().indexOf(filter) is 0
        )
        showChoices that._subtractArray(choices, that.assignedTags())

      
      # Create the input field.
      @tagList.addClass("tagit").addClass("ui-widget ui-widget-content ui-corner-all").append($("<li class=\"tagit-new\"></li>").append(@_tagInput)).click (e) ->
        target = $(e.target)
        if target.hasClass("tagit-label")
          that._trigger "onTagClicked", e, target.closest(".tagit-choice")
        else
          
          # Sets the focus() to the input field, if the user
          # clicks anywhere inside the UL. This is needed
          # because the input field needs to be of a small size.
          that._tagInput.focus()

      
      # Add existing tags from the list, if any.
      @tagList.children("li").each ->
        unless $(this).hasClass("tagit-new")
          that.createTag $(this).html(), $(this).attr("class")
          $(this).remove()

      
      # Single field support.
      if @options.singleField
        if @options.singleFieldNode
          
          # Add existing tags from the input field.
          node = $(@options.singleFieldNode)
          tags = node.val().split(@options.singleFieldDelimiter)
          node.val ""
          $.each tags, (index, tag) ->
            that.createTag tag

        else
          
          # Create our single field input after our list.
          @options.singleFieldNode = @tagList.after("<input type=\"hidden\" style=\"display:none;\" value=\"\" name=\"" + @options.fieldName + "\">")
      
      # Autocomplete.
      if @options.availableTags or @options.tagSource
        @_tagInput.autocomplete
          source: @options.tagSource
          minLength: 2
          select: (event, ui) ->
            
            # Delete the last tag if we autocomplete something despite the input being empty
            # This happens because the input's blur event causes the tag to be created when
            # the user clicks an autocomplete item.
            # The only artifact of this is that while the user holds down the mouse button
            # on the selected autocomplete item, a tag is shown with the pre-autocompleted text,
            # and is changed to the autocompleted text upon mouseup.
            that.removeTag that._lastTag(), false  if that._tagInput.val() is ""
            console.log "ITEM: ", ui.item
            that.createTag ui.item.value, ui.item.label
            
            # Preventing the tag input to be updated with the chosen value.
            false

      
      # Events.
      
      # Backspace is not detected within a keypress, so it must use keydown.
      
      # When backspace is pressed, the last tag is deleted.
      
      # Comma/Space/Enter are all valid delimiters for new tags,
      # except when there is an open quote or if setting allowSpaces = true.
      # Tab will also create a tag, unless the tag input is empty, in which case it isn't caught.
      
      # console.log('this happens every time', $(that).data() );
      
      # The autocomplete doesn't close automatically when TAB is pressed.
      # So let's ensure that it closes.
      @_tagInput.keydown((event) ->
        if event.which is $.ui.keyCode.BACKSPACE and that._tagInput.val() is ""
          tag = that._lastTag()
          if not that.options.removeConfirmation or tag.hasClass("remove")
            that.removeTag tag
          else tag.addClass "remove ui-state-highlight"  if that.options.removeConfirmation
        else that._lastTag().removeClass "remove ui-state-highlight"  if that.options.removeConfirmation
        if event.which is $.ui.keyCode.COMMA or event.which is $.ui.keyCode.ENTER or (event.which is $.ui.keyCode.TAB and that._tagInput.val() isnt "") or (event.which is $.ui.keyCode.SPACE and that.options.allowSpaces isnt true and ($.trim(that._tagInput.val()).replace(/^s*/, "").charAt(0) isnt "\"" or ($.trim(that._tagInput.val()).charAt(0) is "\"" and $.trim(that._tagInput.val()).charAt($.trim(that._tagInput.val()).length - 1) is "\"" and $.trim(that._tagInput.val()).length - 1 isnt 0 and $.trim(that._tagInput.val()).length >= @options.minChars)))
          event.preventDefault()
          that.createTag that._cleanedInput()
          that._tagInput.autocomplete "close"
      ).blur (e) ->
        
        # Create a tag when the element loses focus (unless it's empty).
        that.createTag that._cleanedInput()


    
    # console.log(this._tagInput, this.options.availableTags, this.options.tagSource);
    _cleanedInput: ->
      
      # Returns the contents of the tag input, cleaned and ready to be passed to createTag
      $.trim @_tagInput.val().replace(/^"(.*)"$/, "$1")

    _lastTag: ->
      @tagList.children ".tagit-choice:last"

    assignedTags: ->
      
      # Returns an array of tag string values
      that = this
      tags = []
      if @options.singleField
        tags = $(@options.singleFieldNode).val().split(@options.singleFieldDelimiter)
        tags = []  if tags[0] is ""
      else
        @tagList.children(".tagit-choice").each ->
          tags.push that.tagLabel(this)

      tags

    _updateSingleTagsField: (tags) ->
      
      # Takes a list of tag string values, updates this.options.singleFieldNode.val to the tags delimited by this.options.singleFieldDelimiter
      $(@options.singleFieldNode).val tags.join(@options.singleFieldDelimiter)

    _subtractArray: (a1, a2) ->
      result = []
      i = 0

      while i < a1.length
        result.push a1[i]  if $.inArray(a1[i], a2) is -1
        i++
      result

    tagLabel: (tag) ->
      
      # Returns the tag's string label.
      if @options.singleField
        $(tag).children(".tagit-label").text()
      else
        $(tag).children("input").val()

    _isNew: (value) ->
      that = this
      isNew = true
      @tagList.children(".tagit-choice").each (i) ->
        if that._formatStr(value) is that._formatStr(that.tagLabel(this))
          isNew = false
          false

      isNew

    _formatStr: (str) ->
      return str  if @options.caseSensitive
      $.trim str.toLowerCase()

    createTag: (value, tagLabel, additionalClass) ->
      that = this
      
      # Automatically trims the value of leading and trailing whitespace.
      value = $.trim(value)
      return false  if not @_isNew(value) or value is ""
      
      # Added tag limit check (if limit is hit, clear input and do nothing)
      if @assignedTags().length is @options.selectionLimit
        @_tagInput.val ""
        return false
      
      # var label = $(this.options.onTagClicked ? '<a class="tagit-label"></a>' : '<span class="tagit-label"></span>').text(value);
      if tagLabel
        label = $((if @options.onTagClicked then "<a class=\"tagit-label\"></a>" else "<span class=\"tagit-label\"></span>")).text(tagLabel)
      else
        label = $((if @options.onTagClicked then "<a class=\"tagit-label\"></a>" else "<span class=\"tagit-label\"></span>")).text(value)
      
      # Create tag.
      tag = $("<li></li>").addClass("tagit-choice ui-widget-content ui-state-default ui-corner-all").addClass(additionalClass).append(label)
      
      # Button for removing the tag.
      removeTagIcon = $("<span></span>").addClass("ui-icon ui-icon-close")
      # \xd7 is an X
      removeTag = $("<a><span class=\"text-icon\">×</span></a>").addClass("close").append(removeTagIcon).click((e) ->
        
        # Removes a tag when the little 'x' is clicked.
        that.removeTag tag
      )
      tag.append removeTag
      
      # Unless options.singleField is set, each tag has a hidden input field inline.
      if @options.singleField
        tags = @assignedTags()
        tags.push value
        @_updateSingleTagsField tags
      else
        
        # var escapedValue = label.html();
        # tag.append('<input type="hidden" style="display:none;" value="' + escapedValue + '" name="' + this.options.itemName + '[' + this.options.fieldName + '][]">');
        if tagLabel
          tag.append "<input type=\"hidden\" style=\"display:none;\" value=\"" + value + "\" name=\"" + @options.itemName + "[" + @options.fieldName + "][]\" />"
        else
          escapedValue = label.html()
          tag.append "<input type=\"hidden\" style=\"display:none;\" value=\"" + escapedValue + "\" name=\"" + @options.itemName + "[" + @options.fieldName + "][]\" />"
      @_trigger "onTagAdded", null, tag
      
      # Cleaning the input.
      @_tagInput.val ""
      
      # insert tag
      @_tagInput.parent().before tag

    removeTag: (tag, animate) ->
      animate = true  if typeof animate is "undefined"
      tag = $(tag)
      @_trigger "onTagRemoved", null, tag
      if @options.singleField
        tags = @assignedTags()
        removedTagLabel = @tagLabel(tag)
        tags = $.grep(tags, (el) ->
          el isnt removedTagLabel
        )
        @_updateSingleTagsField tags
      
      # Animate the removal.
      if animate
        tag.fadeOut("fast").hide("blind",
          direction: "horizontal"
        , "fast", ->
          tag.remove()
        ).dequeue()
      else
        tag.remove()

    removeAll: ->
      
      # Removes all tags. Takes an optional `animate` argument.
      that = this
      @tagList.children(".tagit-choice").each (index, tag) ->
        that.removeTag tag, false


) jQuery
