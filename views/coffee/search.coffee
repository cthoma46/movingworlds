$(document).ready ->

  $(".tabs, .tab_widget").tabs cookie:
    expires: 1

  $(".combobox").combobox {}