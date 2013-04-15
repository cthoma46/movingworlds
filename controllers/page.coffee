Page = require('../models').Page
_ = require('underscore')
md = require('markdown').markdown

renderPage = (id, res) ->
  Page.find {}, (err, doc) ->
    if err or not doc
      next()
    else
      edit = _.find(doc, (item) ->
        item._id is id
      )
      res.render 'page_edit',
        title: 'Edit Page'
        headtype: 'nonav'
        pages: doc
        fs:
          getValue: (key) ->
            (if (edit) then edit[key] else '')

module.exports = [

    path: ''
    type: 'USE' 
    action: (req, res, next) ->
      pageName = req.url.substring(1)
      Page.findOne
        slug: pageName
      , (err, doc) ->
        console.log err, doc
        if err or not doc
          next()
        else
          res.render 'page',
            title: doc.title
            body: md.toHTML(doc.body)
  ,
      path: '/cms/page_edit'
      type: 'GET'
      action: (req, res, next) ->
        id = req.query['id']
        renderPage id, res
  ,
      path: '/page_edit'
      type: 'POST'
      action: (req, res, next) ->
        req.body.slug = req.body.title
        page = new Page(req.body)
        upsertData = page.toObject()
        delete upsertData._id

        if req.body.remove
          page.remove ->
            renderPage null, res

        else
          Page.update
            _id: page.id
          , upsertData,
            upsert: true
            mulit: false
          , (err, num) ->
            throw err  if err
            renderPage req.body._id, res
]