$(document).ready ->

  # Set country value before create combobox
  $('#country').val($('#country_value').val());

  $(".combobox").combobox {}

  $(".modal.autoplay").MwModal {}  if $(".modal.autoplay").length > 0

  $("#work_history, #education_history").MwFieldCloner()

  # display extra fields if experteer is chosen.
  # $('#invite_extras select#type').bind( "autocompletechange", function(event, ui) {
  # 	console.log( $(this).val() );
  # 	if($(this).val() == 'experteer') {
  # 		$('.experteer_only').removeClass('hidden');
  # 	}else{
  # 		$('.experteer_only').addClass('hidden').children('input').val('');
  # 	}
  # });
  #

  $('.tags').tagit
			availableTags: ["Option 1","Option 2","Option 3","Option 4"]
			create: (event, ui) ->
			onTagAdded: (event, tag) ->

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

  $(".experteer_box, .se_box").click (e) ->
    $this = $(this)
    e.preventDefault
    $(".experteer_box, .se_box").removeClass "on"
    $this.addClass "on"
    if $this.is(".experteer_box")
      $("li.step2 span").text "Personal Information"
      $("li.step3 span").text "Work & Education"
      $("#next").attr "href", "/register/2/experteer"
      $("input[name=\"type\"]").attr "value", "expterteer"
    else
      $("li.step2 span").text "Company Information"
      $("li.step3 span").text "First Opportunity"
      $("#next").attr "href", "/register/2/se"
      $("input[name=\"type\"]").attr "value", "representative"

  $("input[name='registered[is_registered]']").click ->
    $this = $(this)
    if $this.val() is "true"
      console.log $("#registered_options")
      $("#registered_options").show()
    else
      $("#registered_options").hide()


  $(".slider").slider
    range: "min"
    value: 0
    min: 1
    max: $(this).data("max")
    create: (event, ui) ->
      max = $(this).data("max")
      min = $(this).data("min")
      $(this).slider "option", "max", Number(max)
      $(this).slider "option", "min", Number(min)

    slide: (event, ui) ->
      $(".slider + input[type='hidden']").val ui.value
      $(".slider_label span").text ui.value

  $("#graduated").change ->
    if $(this).is(":checked")
      $("#degree").focus().parents("li").first().removeClass "hidden"
    else
      $("#degree").val("").parents("li").first().addClass "hidden"

  $(".datepicker input").datepicker
    showOn: "both"
    changeMonth: true
    changeYear: true
    buttonImage: "/images/btn_datepicker.png"
    buttonImageOnly: true

  $("form#step1").validate
    rules:
      first_name: "required"
      last_name: "required"
      city: "required"
      country: "required"
      birthday: "required"
      gender: "required"
      password:
        required: true
        minlength: 6
      confirm:
        required: true
        minlength: 6
        equalTo: "#password"
    errorPlacement: (error, element) ->
      if element.closest('.field-container').length > 0
        error.appendTo( element.closest('.field-container') )
      else
        error.insertAfter(element);
