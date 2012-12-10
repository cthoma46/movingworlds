// Generated by CoffeeScript 1.4.0
var extractLast, split;

split = function(del, val) {
  return val.split(/del\s*/);
};

extractLast = function(term) {
  return split(term).pop();
};

$(function() {
  var d;
  d = "placeholder" in document.createElement("input");
  if (!d) {
    return $("input[placeholder]").each(function() {
      return $(this).val(element.attr("placeholder")).addClass("placeholder");
    }).bind("focus", function() {
      if ($(this).val() === element.attr("placeholder")) {
        return $(this).val("").removeClass("placeholder");
      }
    }).bind("blur", function() {
      if ($(this).val() === "") {
        return $(this).val(element.attr("placeholder")).addClass("placeholder");
      }
    });
  }
});
