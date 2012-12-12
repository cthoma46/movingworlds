(($) ->

  setting = undefined
  $backdrop = undefined
  $modal = undefined

  methods =
    init: (options) ->
      settings = $.extend(
        offset:
          x: 0
          y: 0

        backdrop: true
      , options)
      if settings.backdrop
        $backdrop = $("<div class=\"modal_backdrop\"></div>")
        $("body").append $backdrop
        $backdrop.animate(
          opacity: .6
        , 100).click ->
          methods.close()

      $(".modal_close_btn").click (e) ->
        methods.close()

      $modal = @css(display: "block").animate(
        top: "50%"
        opacity: 1
      , 300, "easeOutSine")

    close: ->
      $modal.animate
        top: "-25%"
        opacity: 0
      , 300, "easeOutSine", ->
        $modal.css "display", "none"
        $backdrop.animate
          opacity: 0
        , 100, ->
          $backdrop.remove()



  $.fn.MwModal = (method) ->
    if methods[method]
      methods[method].apply this, Array::slice.call(arguments, 1)
    else if typeof method is "object" or not method
      methods.init.apply this, arguments
    else
      $.error "The method: " + method + " does not exist"
) jQuery
