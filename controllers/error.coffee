module.exports = [

    path: "/404"
    type: "GET"
    login: "none"
    action: (req, res, next) ->
      res.render "errors/404",
        title: "Could not find page"
        error: "That page doesn't exist"
  ,    

    path: "/500"
    type: "GET"
    login: "none"
    action: (req, res, next) ->
      res.render "errors/500",
        title: "Internal Server Error!!"
        error: "Something bad happened"
]