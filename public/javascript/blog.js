// // Generated by CoffeeScript 1.4.0

// $(document).ready(function() {
//   var $template, key, query, searchUrl, seid, uid;
//   key = "AIzaSyBz0pTjRXrP5fv6MzKfjPKibyzHv5krHD8";
//   uid = "004178335380228952443";
//   seid = "bjxktjacrxq";
//   query = document.location.search.split("=").pop();
//   console.log(query);
//   if ((query != null) && query.length) {
//     $template = $('.post').first();
//     $('#posts').empty();
//     searchUrl = "https://www.googleapis.com/customsearch/v1?key=" + key + "&cx=" + uid + ":" + seid + "&q=" + query;
//     $.ajax({
//       url: searchUrl,
//       type: "get",
//       dataType: "json",
//       success: function(data) {
//         var $temp, item, _i, _len, _ref, _results;
//         console.log(data);
//         if ((data.items != null) && data.items.length) {
//           _ref = data.items;
//           _results = [];
//           for (_i = 0, _len = _ref.length; _i < _len; _i++) {
//             item = _ref[_i];
//             $temp = $template.clone();
//             $temp.find("h2").html(item.htmlTitle);
//             $temp.find(".post_body").html(item.htmlSnippet);
//             $temp.find(".more").attr("href", item.link);
//             _results.push($('#posts').append($temp));
//           }
//           return _results;
//         } else {
//           return $('#posts').append("<h1>Nothing found for: <em>" + query + "</em></h1>");
//         }
//       },
//       error: function(err) {
//         return $('#posts').append("<h1>Nothing found for: <em>" + query + "</em></h1>");
//       }
//     });
//   }
//   $("#signup").submit(function() {
//     var data;
//     data = {
//       email: $("#email").val()
//     };
//     $(this).siblings('h4').text("Thank You!");
//     $('#signup_form').delay(2000).slideUp("fast");
//     localStorage.setItem('newsletter', true);
//     return false;
//   });
//   if (!localStorage.getItem('newsletter')) {
//     return $('#signup_form').show();
//   }
// });
