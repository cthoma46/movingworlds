function renderGeneric(options){
  var options = options || {};
  if (!options.view) throw {
    error: "AttributeError",
    message: "options.view is required"
  }

  return function(req, res, next){
    return res.render(options.view, options.context);
  }
}



module.exports = {
  about: renderGeneric({
    view: 'generic/pages/about',
    context: {
      slug: 'about',
      title: 'About'
    }
  }),
  partners: renderGeneric({
    view: 'generic/pages/partners',
    context: {
      slug: 'partners',
      title: 'Partners'
    }
  }),
}
