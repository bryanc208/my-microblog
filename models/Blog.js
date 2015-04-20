var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    title: String,
    author: String,
    body: String,
    likes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    date: { type: Date, default: Date.now },
    imageURL: String
});

blogSchema.methods.likePost = function(cb){
    this.likes += 1;
    this.save(cb);
}

mongoose.model('Blog', blogSchema);