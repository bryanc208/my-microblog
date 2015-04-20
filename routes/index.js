var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');
var Comment = mongoose.model('Comment');
var fs = require('fs');
var path = require('path');
var os = require('os');

router.get('/posts', function(req, res, next){
    Blog.find(function(err, posts){
        if(err){
            return next(err);
        }
        res.json(posts);
    });
});

router.post('/posts', function(req, res, next){
    var post = new Blog(req.body);
    console.log(req.body);
    post.save(function(err, post){
        if(err){
            return next(err);
        }
        res.json(post);
    });
});
              
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

router.get('/posts/:post', function(req, res){
    req.blogPost.populate('comments', function(err,post){
        if(err) {
            return next(err);
        }
        res.json(req.blogPost);        
    });
});            

router.delete('/posts/:post/remove', function(req, res, next){
    req.blogPost.remove(function(err, post){
        if(err){
            return next(err);
        }
        res.json(req.blogPost);
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

router.get('/posts/:post/comments/:comment', function(req, res){
    res.json(req.comment);
});            

router.post('/api/upload', function(req, res){
    req.busboy.on('file', function(fieldname, file, filename){
        var saveTo = path.join(__dirname + "/../public/images/", path.basename(filename));
        file.pipe(fs.createWriteStream(saveTo));
        res.end(path.join("/images/", path.basename(filename)));
    });
});
module.exports = router;
