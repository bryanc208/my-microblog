var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var Blog = mongoose.model('Blog');
var Comment = mongoose.model('Comment');

router.param('post', function(req, res, next, id){
    var query = Blog.findById(id);
    
    query.exec(function (err, blogPost){
        if(err){
            return next(err);
        }
        if(!blogPost){
            return next(new Error("Can't find post"));
        }
        req.blogPost = blogPost;
        return next();
    });
});

router.param('author', function(req, res, next, name){
    var query = Blog.find({author: name});
    query.exec(function (err, authoredBlogPosts){
        if(err){
            return next(err);
        }
        if(!authoredBlogPosts){
            return next(new Error("Can't find author"));
        }
        req.authoredBlogPosts = authoredBlogPosts;
        return next();
    });
});

router.param('comment', function(req, res, next, id){
    var query = Comment.findById(id);
    
    query.exec(function (err,comment){
        if(err){
            return next(err);
        }
        if(!comment){
            return next(new Error("Can't find comment"));
        }
        req.comment = comment;
        return next();
    });
});

router.get('/:author/home', function(req, res){
    res.json(req.authoredBlogPosts);
});

router.get('/posts', function(req, res, next){
    Blog.find(function(err, posts){
        if(err){
            return next(err);
        }
        res.json(posts);
    });
});
              
router.get('/posts/:post', function(req, res){
    req.blogPost.populate('comments', function(err, post){
        if(err) {
            return next(err);
        }
        res.json(req.blogPost);        
    });
});            

router.get('/posts/:post/comments/:comment', function(req, res){
    res.json(req.comment);
});      

router.post('/posts', function(req, res, next){
    var post = new Blog(req.body);
    var imgPath = req.body.imagePath;
    var imgData = fs.readFileSync(imgPath);
    var imgType = mime.lookup(imgPath);
    post.img.data = imgData.toString('base64');
    post.img.contentType = imgType;
    post.save(function(err, post){
        if(err){
            return next(err);
        }
        res.json(post);
    });
});

router.post('/posts/:post/comments', function(req,res,next){
    var comment = new Comment(req.body);
    comment.post = req.post;
    
    comment.save(function(err, comment){
        if(err){
            return next(err);
        }
        req.blogPost.comments.push(comment);
        req.blogPost.save(function(err, comment){
            if(err){
                return next(err);
            }
            res.json(comment);
        });
    });
});

router.post('/api/upload', function(req, res){
    req.busboy.on('file', function(fieldname, file, filename){
        var saveTo = path.join(__dirname + "/../public/images/", path.basename(filename));
        file.pipe(fs.createWriteStream(saveTo));
        res.end(saveTo);
    });
});

router.delete('/posts/:post/remove', function(req, res, next){
    var postId = req.blogPost._id;
    Blog.findByIdAndRemove(postId, function(err, post){
        if (err){
            return next(err);
        }
        res.json(post);
    });
});

router.put('/posts/:post/likePost', function(req, res, next){
    req.blogPost.likePost(function(err, post){
        if(err) {
            return next(err);
        }
        res.json(post);
    });
});

module.exports = router;
