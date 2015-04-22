# my-microblog

This microblog was created from scratch using MEAN stack. This small project helped me learn the basics of a completely new framework. It was a lot of fun and hopefully I can expand on this knowledge to create some cool apps with these technologies in the future!

##Features:
  * Can add/remove blog posts that contain up to 160 characters and one image
  * Images are saved directly to the database
    * Images are loaded from the database and are not simply referenced from the server's filesystem
  * Supports multiple blogs
    * Simply change the name in the URL or go to home and type in a new, unique name
  * Like posts!
  * Comment on posts
  
##Architecture:
  * Client side code uses Angular.js
  * Server implemented using Node.js and Express
  * Backend: MongoDB and Mongoose.js

Tested only on Chrome. May not work well with other browsers.

----

##To test out the website:

All dependencies have been well defined, simply clone the repository and run:

  `npm install` from the cloned directory.
  
Make sure to have MongoDB running in the `data` directory (`/../GitHub/my-microblog/data`). Simply navigate to the `data` directory and type:

  `mongod`

Then, run a seperate terminal/cmd window and within the app directory (`/../GitHub/my-microblog`) run:

  `npm start`
  
That's it! You should now be able to go to `http://localhost:3000` and type in the name of a blog of your choice!

Enjoy!
