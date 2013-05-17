;(function () {

  var BodyView = Backbone.View.extend({
    el : 'body'
  })

  var SearchView = Backbone.View.extend({
    tagName : 'ul',
    className : 'search',

    initialize : function () {
      this.listenTo(this.model, 'change', this.render)
      // collection.fetch({ data: $.param({ page: 1}) });
    },

    render : function () { }

  })

  var SearchItemView = Backbone.View.extend({
    tagName : 'li',
    className : 'search-item',

    initialize : function () {
      this.listenTo(this.model, 'change', this.render)
    },

    render : function () { }

  })

  var body = new BodyView()
  var search = new SearchView()

}());
