$.extend $.easing,
  easeOutBounce: (x, t, b, c, d) ->
    if (t /= d) < (1 / 2.75)
      c * (7.5625 * t * t) + b
    else if t < (2 / 2.75)
      c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b
    else if t < (2.5 / 2.75)
      c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b
    else
      c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b

  easeInSine: (x, t, b, c, d) ->
    -c * Math.cos(t / d * (Math.PI / 2)) + c + b

  easeOutSine: (x, t, b, c, d) ->
    c * Math.sin(t / d * (Math.PI / 2)) + b

  easeInOutSine: (x, t, b, c, d) ->
    -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b

