module.exports = [

    path: "/blog"
    type: "GET"
    action: (req, res) ->
      res.render "blog.jade",
        locals:
          title: "Blog"
          layout: "layout_blog"

]