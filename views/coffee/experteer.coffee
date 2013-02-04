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

  # Set some value before combobox
  $('#impact').val($('#impact_value').val());
  $('#industry').val($('#industry_value').val());

  # Change status
  $('.change_status').click (e) ->
    e.preventDefault()
    status = $(this).data('status')
    $.doPost('/experteer/update', { status: status })

  $(".combobox").combobox {}
  multiTag('#areas', 'area_support')

multiTag = (container, type) ->
  if $('#' + type + "_values")
    values = $('#' + type + "_values").val()
    values = JSON.parse(values)
    Object.keys(values).forEach (v) ->
      addTag(container, type, v, values[v])

  $("#add_" + type).click (e) ->
    e.preventDefault()

    value = $('#' + type).val()
    label = $('#' + type + ' option:selected').text()

    addTag(container, 'area_support', value, label)

addTag = (container, type, value, label) ->

  if value != '' && $("input[name='#{type}'][value='#{value}']").length == 0 && $("input[name='#{type}']").length < 6
    option = "<p class='tagit-choice'><span class='tagit-label'>#{label}</span><a class='close'><span class='text-icon'>×</span><span class='ui-icon ui-icon-close'></span></a><input type='hidden' name='area_support' value='#{value}' /></p>"

    $(container).append(option)
    $('#' + type).next().find('input').val("")

    $("p.tagit-choice .close").click (e) ->
      e.preventDefault()
      $(this).parent().remove()