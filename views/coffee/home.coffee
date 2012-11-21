$(document).ready ->
	
 	$("#dotmap").MwFeature()

  # home page invite field
  $("#get_invite_btn").click (e) ->
    e.preventDefault()
    $("#invite_form input").focus()
