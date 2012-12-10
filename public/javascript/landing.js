// Generated by CoffeeScript 1.4.0

$(document).ready(function() {
  $(".tabs, .tab_widget").tabs({
    cookie: {
      expires: 1
    }
  });
  $("#msg_to").tagit({
    availableTags: ["Option 1", "Option 2", "Option 3", "Option 4"],
    tagSource: function(search, response) {
      var that;
      that = this;
      return $.ajax({
        url: "/api/user",
        data: {
          fields: "first_name|last_name",
          search: search.term
        },
        success: function(data) {
          try {
            return response($.map(data, function(item) {
              return {
                value: item._id,
                label: item.first_name + " " + item.last_name
              };
            }));
          } catch (_error) {}
        }
      });
    },
    onTagAdded: function(event, ui) {}
  });
  $(".reply_btn a").click(function(e) {
    var $this, subject;
    e.preventDefault();
    $this = $(this);
    $(".tabs").tabs("select", 2);
    $("#msg_to").tagit("removeAll");
    $("#msg_to").tagit("createTag", $this.data("uid"), $this.data("name"));
    subject = $this.parents(".email").first().find("h3").text();
    $("#msg_subject").val("RE: " + subject);
    return $("#msg_body").focus();
  });
  return $(".delete_msg_btn").click(function(e) {
    var $this;
    e.preventDefault();
    $this = $(this);
    return $.ajax({
      url: "/api/messages",
      method: "delete",
      data: {},
      success: function(data) {
        console.log(data);
        return $this.parents(".email").first().slideUp();
      }
    });
  });
});
