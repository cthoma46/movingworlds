$(document).ready ->

  key = "AIzaSyBz0pTjRXrP5fv6MzKfjPKibyzHv5krHD8"
  uid = "004178335380228952443"
  seid = "bjxktjacrxq"
  query = document.location.search.split("=").pop()

  console.log query
  if query? and query.length
    $template = $('.post').first()
    $('#posts').empty()
    searchUrl = "https://www.googleapis.com/customsearch/v1?key=#{key}&cx=#{uid}:#{seid}&q=#{query}"
    $.ajax
      url: searchUrl
      type: "get"
      dataType: "json"
      success: (data) ->
        console.log data
        if data.items? and data.items.length
          for item in data.items
            $temp = $template.clone()
            $temp.find("h2").html(item.htmlTitle)
            $temp.find(".post_body").html(item.htmlSnippet)
            $temp.find(".more").attr("href", item.link)
            $('#posts').append($temp)
        else
          $('#posts').append("<h1>Nothing found for: <em>#{query}</em></h1>")
      error: (err) ->
        $('#posts').append("<h1>Nothing found for: <em>#{query}</em></h1>")

  $("#signup").submit () ->
    data = 
      email:$("#email").val()
    # $.post '/invite', data, (res) ->
    $(this).siblings('h4').text("Thank You!")
    $('#signup_form').delay(2000).slideUp("fast")
    localStorage.setItem('newsletter', true);
    return false      


  if !localStorage.getItem('newsletter')
    $('#signup_form').show()



  # TEST 
  # data = 
  #   items: [
  #     htmlTitle: "TEST TITLE 1"
  #     htmlSnippet: "This is a test snippet"
  #     link: "link"
  #   ,
  #     htmlTitle: "TEST TITLE 2"
  #     htmlSnippet: "This is a test snippet"
  #     link: "link"
  #   ,
  #     htmlTitle: "TEST TITLE 3"
  #     htmlSnippet: "This is a test snippet"
  #     link: "link"
  #   ,
  #     htmlTitle: "TEST TITLE 4"
  #     htmlSnippet: "This is a test snippet"
  #     link: "link"
  #   ]



  # $template = $('.post').first()
  # $('#posts').empty()
  
  # for item in data.items
  #   $temp = $template.clone()
  #   $temp.find("h2").html(item.htmlTitle)
  #   $temp.find(".post_body").html(item.htmlSnippet)
  #   $temp.find(".more").attr("href", item.link)
  #   $temp.find('time').remove()
  #   $('#posts').append($temp)
