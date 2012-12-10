module.exports = [

    path: "/blog"
    type: "GET"
    action: (req, res) ->
      res.render "blog",
        locals:
          title: "Blog"
          layout: "layout_blog"

]