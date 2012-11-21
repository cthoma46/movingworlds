mongoose = require("mongoose")
Schema = mongoose.Schema
collection_name = "mw_settings"

# var snippetSchema = new Schema({
# 		key: String
# 	,	value: String
# });
settingSchema = new Schema(counties: Array)
Settings = mongoose.model(collection_name, settingSchema)
module.exports = Settings
