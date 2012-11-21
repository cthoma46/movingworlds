#
split = (del, val) ->
  val.split /del\s*/

# Get the last item from Array
extractLast = (term) ->
  split(term).pop()

# globally enable placeholder attribute in older browsers  
$ ->
  d = "placeholder" of document.createElement("input")
  unless d
    $("input[placeholder]").each(->
      $(this).val(element.attr("placeholder")).addClass "placeholder"
    ).bind("focus", ->
      $(this).val("").removeClass "placeholder"  if $(this).val() is element.attr("placeholder")
    ).bind "blur", ->
      $(this).val(element.attr("placeholder")).addClass "placeholder"  if $(this).val() is ""

