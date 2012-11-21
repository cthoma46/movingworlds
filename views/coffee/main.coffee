$(document).ready ->
	
  $(".subnav").hoverIntent
    over: ->
      $(this).children("ul").first().slideDown "fast"

    out: ->
      $(this).children("ul").first().slideUp()

    timeout: 500

  $("#flash_message").delay(2000).slideUp "slow"