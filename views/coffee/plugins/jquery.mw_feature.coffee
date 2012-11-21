#!
# * jQuery Moving Worlds Feature Plugin
# * Original author: Jonah Werre
# 
(($, window, document, undefined_) ->
  MwFeature = (element, options) ->
    @element = element
    @settings = $.extend({}, defaults, options)
    @popup
    @markerData
    @markers = []
    @currentIndex
    @rotateInterval
    @_defaults = defaults
    @_name = pluginName
    @init()
  pluginName = "MwFeature"
  defaults =
    offset:
      x: 26
      y: 50
    autoStart: 8000
    dropRate: 1
    startIndex: 0
    popupTemplate: "<div class=\"testemonial_popup\"><header><h2></h2><a href=\"#\" class=\"close_btn\">close</a></header><section class=\"video_testimony\"><iframe id=\"yplayer\" width=\"425\" height=\"216\" src=\"\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"></iframe></section><section class=\"profile\"><div class=\"avatar\"><div class=\"av_img_container\"><img src=\"images/tmp_avatar1.png\"></div></div><div class=\"profile_info\"><hgroup><h3></h3><h4></h4></hgroup><p></p></div></section><div class=\"popup_arrow\"></div></div>"
    markerTemplate: "<div class=\"marker\"></div>"

  MwFeature:: =
    init: ->
      _this = this
      _this.popup = $(_this.settings.popupTemplate).appendTo(_this.element)
      _this.markerData = featureData
      for i of _this.markerData
        data = _this.markerData[i]
        marker = $(_this.settings.markerTemplate).appendTo(_this.element).addClass(data.type + "_icn").css(
          top: "-100px"
          left: data.x + "px"
        ).delay(i * _this.settings.dropRate * 100).animate(
          top: data.y + "px"
          opacity: 1
        , 800, "easeOutBounce", ->
          index = $(this).index(".marker")
          if index is _this.settings.startIndex
            _this.open index, 2000
            _this.play _this.settings.startIndex  if _this.settings.autoStart > 0
        ).click((e) ->
          e.preventDefault()
          _this.open $(this).index(".marker")
        )

        _this.markers.push $(marker)

      $(".testemonial_popup .close_btn").click (e) ->
        e.preventDefault()
        _this.hide()

      $(@popup).hover ->
        _this.pause()


    open: (index, delay) ->
      console.log "open", index, delay
      _this = this
      if index is _this.currentIndex
        _this.hide()
        return
      delay = 0  if typeof delay is "undefined"
      _this.currentIndex = index
      position = _this.markers[index].position()
      left = position.left > $(_this.element).width() * .5
      $arrow = $(_this.popup).children(".popup_arrow").first()
      yPos = _this.settings.offset.y
      xPos = (if (left) then position.left - 447 - _this.settings.offset.x * .5 else position.left + _this.settings.offset.x)
      
      arrowPos = {}
      
      if position.left > $(_this.element).width() * .5
        arrowPos =
          right: "-13px"
          top: position.top - _this.settings.offset.y + "px"
          "background-position": "-36px -20px"
      else
        arrowPos =
          left: "-13px"
          top: position.top - _this.settings.offset.y + "px"
          "background-position": "-36px 0px"
      
      
      # console.log(_this.markerData);
      $(_this.popup).slideUp "fast", "easeInSine", ->
        $(".testemonial_popup h2").text _this.markerData[index].h2
        $(".testemonial_popup h3").text _this.markerData[index].h3
        $(".testemonial_popup h4").text _this.markerData[index].h4
        $(".testemonial_popup p").text _this.markerData[index].description
        $(".testemonial_popup img").attr "src", _this.markerData[index].image
        $("#yplayer").attr "src", "http://www.youtube.com/embed/" + _this.markerData[index].video_id + "?controls=1&showinfo=0"
        $(_this.popup).attr("style", "").css
          left: xPos + "px"
          top: yPos + "px"

        $arrow.attr("style", "").css arrowPos
        $(_this.popup).delay(delay).slideDown "slow", "easeOutSine"


    hide: (speed) ->
      _this = this
      speed = "fast"  if typeof speed is "undefined"
      _this.pause()
      _this.currentIndex = null
      $("#yplayer").attr "src", ""
      $(_this.popup).slideUp speed, "easeOutSine", ->


    play: (from) ->
      _this = this
      count = from
      _this.rotateInterval = setInterval(->
        if count < _this.markers.length - 1
          count++
        else
          count = 0
        _this.open count, 500
      , _this.settings.autoStart)

    pause: ->
      _this = this
      clearInterval _this.rotateInterval

  $.fn[pluginName] = (options) ->
    @each ->
      $.data this, "plugin_" + pluginName, new MwFeature(this, options)  unless $.data(this, "plugin_" + pluginName)

) jQuery, window, document