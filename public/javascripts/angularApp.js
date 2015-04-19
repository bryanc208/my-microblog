var app = angular.module("myBlog", ['ui.router']);

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
        });
    $urlRouterProvider.otherwise('home');
}
]);

app.factory('posts', ['$http', function($http){
    var postsObject = {
        posts: []
    };
    
    postsObject.getSinglePost = function(id){
        return $http.get('/posts/' + id).then(function(res){
            return res.data;
        });
    };
    
    postsObject.getAllPosts = function(){
        return $http.get('/posts').success(function(data){
            angular.copy(data, postsObject.posts);
        });
    };
    
    postsObject.createNewPost = function(post){
        return $http.post('/posts', post).success(function(data){
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
function($scope, posts) {
    $scope.posts = posts.posts;
    $scope.addPost = function(){
        if(!$scope.title || $scope.title === ''){
            alert("Enter a valid title!");
            return;
        }
        posts.createNewPost({
            title: $scope.title,
            body: $scope.body
        });
        $scope.title = '';
        $scope.body = '';
    };
    
    $scope.likePost = function(post){
        posts.incrementLikes(post);
    };
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

