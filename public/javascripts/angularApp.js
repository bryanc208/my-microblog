var app = angular.module("myBlog", ['ui.router', 'angularFileUpload']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'MainCtrl',
            resolve: {
                postPromise: ['posts', function(posts){
                    var allPosts = posts.getAllPosts();
                    return allPosts;
                }]
            }
        })
        .state('posts', {
            url: '/posts/:id',
            templateUrl: '/posts.html',
            controller: 'PostsCtrl',
            resolve: {
                post: ['$stateParams', 'posts', function($stateParams, posts){
                    var singlePost = posts.getSinglePost($stateParams.id);
                    return singlePost;    
                }]
            }
        })
        .state('author', {
            url: '/:author/home',
            templateUrl: '/home.html',
            controller: 'MainCtrl',
            resolve: {
                post: ['$stateParams', 'posts', function($stateParams, posts){
                    var authoredPosts = posts.getAllPostsByAuthor($stateParams.author);
                    return authoredPosts;    
                }]
            }
        });
    $urlRouterProvider.otherwise('home');
}
]);

app.factory('posts', ['$http', function($http){
    var postsObject = {
        posts: []
    };
    
    postsObject.getSinglePost = function(id){
        console.log(id);
        return $http.get('/posts/' + id).then(function(res){
            return res.data;
        });
    };
    
    postsObject.removePostFromDB = function(post){
        return $http.delete('/posts/' + post._id + '/remove/').then(function(res){
            postsObject.posts.pop(post);
        });
    };
    
    postsObject.getAllPosts = function(){
        return $http.get('/posts').success(function(data){
            angular.copy(data, postsObject.posts);
        });
    };
    
    postsObject.getAllPostsByAuthor = function(author){
        return $http.get('/' + author + '/home').success(function(data){
            angular.copy(data, postsObject.posts);
        });
    };
    
    postsObject.createNewPost = function(post){
        console.log(post);
        return $http.post('/posts/', post).success(function(data){
            postsObject.posts.push(data);
        });
    };
    
    postsObject.incrementLikes = function(post){
        return $http.put('/posts/' + post._id+'/likePost')
            .success(function(data){
                post.likes += 1;
            });
    };
    
    postsObject.postComment = function(id, comment){
        return $http.post('/posts/' + id + '/comments', comment);
    };

    return postsObject;
}]);

app.controller('MainCtrl', [
'$scope',
'posts',
'$upload',
function($scope, posts, $upload) {
    $scope.posts = posts.posts;
    $scope.addPost = function(){
        if(!$scope.title || $scope.title === ''){
            alert("Enter a valid title!");
            return;
        }
        posts.createNewPost({
            author: "Man",
            title: $scope.title,
            body: $scope.body,
            imageURL: $scope.imageURL
        });
        $scope.title = '';
        $scope.body = '';
        $scope.imageURL = '';
    };
    
    $scope.likePost = function(post){
        posts.incrementLikes(post);
    };
    
    $scope.deletePost = function(post){
        posts.removePostFromDB(post);
    };
    
    $scope.onFileSelect = function($files){
        for(var i=0; i<$files.length; i++){
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: '/api/upload',
                method: 'POST',
                data: {myObj: $scope.userImage},
                file: file,
            }).progress(function(evt){
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config){
                $scope.imageURL = data;
            });
        }
    }
}   
]);


app.controller('PostsCtrl', [
'$scope',
'posts',
'post',
function($scope, posts, post){
    $scope.post = post;
    
    $scope.postComment = function(){
        if($scope.body === '') {
            return;
        }
        var comment = {
            author: $scope.author,
            body: $scope.body
        }
        posts.postComment(post._id, comment);
        $scope.post.comments.push(comment);
        $scope.body = '';
    }
}]);

