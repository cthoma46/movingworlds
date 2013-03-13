// Generated by CoffeeScript 1.4.0

$(document).ready(function() {
  $('#country').val($('#country_value').val());
  $('#type').val($('#type_value').val());
  $('#size').val($('#size_value').val());
  $('#representative_type').val($('#representative_type_value').val());
  $(".combobox").combobox({});
  if ($(".modal.autoplay").length > 0) {
    $(".modal.autoplay").MwModal({});
  }
  $("#work_history, #education_history").MwFieldCloner();
  $('.tags').tagit({
    availableTags: ["Option 1", "Option 2", "Option 3", "Option 4"],
    create: function(event, ui) {},
    onTagAdded: function(event, tag) {}
  });
  $("#add_support").click(function(e) {
    var label, option, value;
    e.preventDefault();
    value = $('#area_support').val();
    label = $('#area_support option:selected').text();
    if (value !== '' && $("input[name='area_support'][value='" + value + "']").length === 0 && $("input[name='area_support']").length < 6) {
      option = "<p class='tagit-choice'><span class='tagit-label'>" + label + "</span><a class='close'><span class='text-icon'>×</span><span class='ui-icon ui-icon-close'></span></a><input type='hidden' name='area_support' value='" + value + "' /></p>";
      $('#areas').append(option);
      $(this).parent().val("");
      return $("p.tagit-choice .close").click(function(e) {
        e.preventDefault();
        return $(this).parent().remove();
      });
    }
  });
  $("#add_support_needed").click(function(e) {
    var label, option, value;
    e.preventDefault();
    value = $('#area_support_needed').val();
    label = $('#area_support_needed option:selected').text();
    if (value !== '' && $("input[name='opportunity[area_support]'][value='" + value + "']").length === 0 && $("input[name='opportunity[area_support]']").length < 6) {
      option = "<p class='tagit-choice'><span class='tagit-label'>" + label + "</span><a class='close'><span class='text-icon'>×</span><span class='ui-icon ui-icon-close'></span></a><input type='hidden' name='opportunity[area_support]' value='" + value + "' /></p>";
      $('#areas').append(option);
      $(this).parent().val("");
      return $("p.tagit-choice .close").click(function(e) {
        e.preventDefault();
        return $(this).parent().remove();
      });
    }
  });
  $(".experteer_box, .org_box").click(function(e) {
    var $this;
    $this = $(this);
    e.preventDefault;
    $(".experteer_box, .org_box").removeClass("on");
    $this.addClass("on");
    if ($this.is(".experteer_box")) {
      $("li.step2 span").text("Personal Information");
      $("li.step3 span").text("Work & Education");
      $("#next").attr("href", "/register/2/experteer");
      return $("input[name=\"type\"]").attr("value", "experteer");
    } else {
      $("li.step2 span").text("Company Information");
      $("li.step3 span").text("First Opportunity");
      $("#next").attr("href", "/register/2/org");
      return $("input[name=\"type\"]").attr("value", "representative");
    }
  });
  $("input[name='registered[is_registered]']").click(function() {
    var $this;
    $this = $(this);
    if ($this.val() === "true") {
      return $("#registered_options").show();
    } else {
      return $("#registered_options").hide();
    }
  });
  if ($("#registered_yes").is(':checked')) {
    $("#registered_options").show();
  }
  $(".slider").slider({
    range: "min",
    value: 0,
    min: 1,
    max: $(this).data("max"),
    create: function(event, ui) {
      var max, min;
      max = $(this).data("max");
      min = $(this).data("min");
      $(this).slider("option", "max", Number(max));
      return $(this).slider("option", "min", Number(min));
    },
    slide: function(event, ui) {
      $(".slider + input[type='hidden']").val(ui.value);
      return $(".slider_label span").text(ui.value);
    }
  });
  $("#graduated").change(function() {
    if ($(this).is(":checked")) {
      return $("#degree").focus().parents("li").first().removeClass("hidden");
    } else {
      return $("#degree").val("").parents("li").first().addClass("hidden");
    }
  });
  $(".date").datepicker({
    showOn: "both",
    yearRange: '0:+10',
    defaultDate: new Date(),
    changeMonth: true,
    changeYear: true,
    buttonImage: "/images/btn_datepicker.png",
    buttonImageOnly: true
  });
  $("#birthday").datepicker({
    showOn: "both",
    yearRange: '-100:-18',
    defaultDate: new Date(1980, 0, 1),
    changeMonth: true,
    changeYear: true,
    buttonImage: "/images/btn_datepicker.png",
    buttonImageOnly: true
  });
  $("#step1").validate({
    rules: {
      first_name: "required",
      last_name: "required",
      city: "required",
      country: "required",
      birthday: "required",
      gender: "required",
      password: {
        required: true,
        minlength: 6
      },
      confirm: {
        required: true,
        minlength: 6,
        equalTo: "#password"
      }
    },
    errorPlacement: function(error, element) {
      if (element.closest('.field-container').length > 0) {
        return error.appendTo(element.closest('.field-container'));
      } else {
        return error.insertAfter(element);
      }
    }
  });
  $("#rep_step2").validate({
    rules: {
      name: "required",
      type: "required",
      size: "required",
      representative_type: "required"
    },
    errorPlacement: function(error, element) {
      if (element.closest('.field-container').length > 0) {
        return error.appendTo(element.closest('.field-container'));
      } else {
        return error.insertAfter(element);
      }
    }
  });
  return $("#rep_step3").validate({
    rules: {
      "opportunity[name]": "required",
      "opportunity[city]": "required",
      "opportunity[details]": "required",
      "opportunity[deadline]": "required",
      "opportunity[start]": "required",
      "opportunity[end]": "required",
      "opportunity[desired_results]": "required",
      "opportunity[country]": "required",
      "opportunity[experience]": "required",
      "opportunity[area_support]": "required",
      "opportunity[skills]": "required",
      "opportunity[language]": "required"
    },
    errorPlacement: function(error, element) {
      if (element.closest('.field-container').length > 0) {
        return error.appendTo(element.closest('.field-container'));
      } else {
        return error.insertAfter(element);
      }
    }
  });
});
