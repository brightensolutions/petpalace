const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name:     { type: String, required: true },
  slug:     { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null }
});

module.exports = mongoose.model('Category', CategorySchema);
