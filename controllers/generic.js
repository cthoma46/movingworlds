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

  faq: renderGeneric({
    view: 'generic/pages/faq',
    context: {
      slug: 'faq',
      title: 'Frequently Asked Questions'
    }
  }),

  resources: renderGeneric({
    view: 'generic/pages/resources',
    context: {
      slug: 'resources',
      title: 'Resources'
    }
  }),

  organization_info: renderGeneric({
    view: 'generic/pages/organizations',
    context: {
      slug: 'organization-info',
      title: 'Info for Organizations'
    }

  experteer_info: renderGeneric({
    view: 'generic/pages/experteers',
    context: {
      slug: 'organization-info',
      title: 'Info for Organizations'
    }
  }),  }),
}
