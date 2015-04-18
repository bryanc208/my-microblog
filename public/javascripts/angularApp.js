var app = angular.module('myBlog', []);

app.controller("MainCtrl", [
'$scope',
'posts',
function($scope, posts) {                            
    $scope.posts = posts.posts;
    $scope.test = "Hello world!";
    $scope.posts = [];
    $scope.addPost = function(){
        if(!$scope.title || $scope.title === ''){
            alert("Enter a valid title!");
            return;
        }
        $scope.posts.push({
            title: $scope.title,
            body: $scope.body,
            likes: 0
        });
        $scope.title = '';
        $scope.body = '';
    };
    
    $scope.likePost = function(post){
        post.likes++;
    }
}   
]);

app.factory('posts', [function(){
    var postsObject = {
        posts: []
    };
    return postsObject;
}])