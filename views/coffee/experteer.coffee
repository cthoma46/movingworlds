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

  $(".combobox").combobox {}

  $("#add_support").click (e) ->
    e.preventDefault()

    value = $('#area_support').val()
    label = $('#area_support option:selected').text()

    if value != '' && $("input[name='area_support'][value='#{value}']").length == 0 && $("input[name='area_support']").length < 6
      option = "<p class='tagit-choice'><span class='tagit-label'>#{label}</span><a class='close'><span class='text-icon'>×</span><span class='ui-icon ui-icon-close'></span></a><input type='hidden' name='area_support' value='#{value}' /></p>"

      $('#areas').append(option);
      $(this).parent().val("")

      $("p.tagit-choice .close").click (e) ->
        e.preventDefault()
        $(this).parent().remove()