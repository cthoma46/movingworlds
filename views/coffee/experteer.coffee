$(document).ready ->

  $('#edit_profile').click (e) ->
    e.preventDefault()
    $(this).hide()
    $('#profile_form').show()
    $('#profile_info').hide()

  $('#cancel_profile').click (e) ->
    e.preventDefault()
    $('#profile_form').hide()
    $('#profile_info').show()
    $('#edit_profile').show()

  $(".datepicker input").datepicker
    showOn: "both"
    changeMonth: true
    changeYear: true
    buttonImage: "/images/btn_datepicker.png"
    buttonImageOnly: true

  $('.tags').tagit
    availableTags: ["Option 1","Option 2","Option 3","Option 4"]
    create: (event, ui) ->
    onTagAdded: (event, tag) ->