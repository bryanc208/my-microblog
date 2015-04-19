var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    body: String,
    author: String,
    password: String,
    post: {type: Schema.Types.ObjectId, ref: 'Post'}
});

mongoose.model('Comment', commentSchema);