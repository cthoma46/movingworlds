$(document).ready ->

  $(".modal.autoplay").MwModal {}  if $(".modal.autoplay").length > 0
  $("form.validate").validate
    errorPlacement: (error, element) ->
      if element.closest('.field-container').length > 0
        error.appendTo( element.closest('.field-container') )
      else
        error.insertAfter(element);
