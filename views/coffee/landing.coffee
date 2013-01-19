$(document).ready ->

  $(".tabs, .tab_widget").tabs cookie:
    expires: 1

  # $("#msg_to").tagit
  #   availableTags: ["Option 1", "Option 2", "Option 3", "Option 4"]
  #   tagSource: (search, response) ->
  #     that = this
  #     $.ajax
  #       url: "/api/user"
  #       data:
  #         fields: "first_name|last_name"
  #         search: search.term

  #       success: (data) ->
  #         try
  #           response $.map(data, (item) ->
  #             value: item._id
  #             label: item.first_name + " " + item.last_name
  #           )

  #   onTagAdded: (event, ui) ->

  $(".reply_btn a").click (e) ->
    e.preventDefault()
    $this = $(this)
    $(".tabs").tabs "select", 2
    $("#msg_to").tagit "removeAll"
    $("#msg_to").tagit "createTag", $this.data("uid"), $this.data("name")
    subject = $this.parents(".email").first().find("h3").text()
    $("#msg_subject").val "RE: " + subject
    $("#msg_body").focus()

  $(".delete_msg_btn").click (e) ->
    e.preventDefault()
    $this = $(this)
    $.ajax
      url: "/api/messages"
      method: "delete"
      data: {}
      success: (data) ->
        console.log data
        $this.parents(".email").first().slideUp()

