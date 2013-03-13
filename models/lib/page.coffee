mongoose = require('mongoose')
Schema = mongoose.Schema
ObjectId = Schema.ObjectId
utils = require('./utils')

snippetSchema = new Schema(
  key: String
  value: String
  type:
    type: String
    enum: ['text', 'select', 'textarea', 'checkbox', 'radio']
    default: 'text'
)

pageSchema = new Schema(
  title: String
  slug:
    type: String
    set: utils.slugify

  body: String
  author_id: ObjectId
  weight: Number
  parent_id: ObjectId
  category_id: ObjectId
  created: Date
  updated:
    type: Date
    default: Date.now()

  status:
    type: String
    enum: ['draft', 'published', 'private']
    default: 'draft'

  type:
    type: String
    enum: ['post', 'page']
    default: 'page'

  language:
    type: String
    default: 'english'

  template:
    type: String
    validate: /^(((http|https):\/\/)?([[a-zA-Z0-9]\-\.])+(\.)([[a-zA-Z0-9]]){2,4}([[a-zA-Z0-9]\/+=%&_\.~?\-]*))*$/

  snippets: {}
)

Page = mongoose.model('page', pageSchema)
module.exports = Page
