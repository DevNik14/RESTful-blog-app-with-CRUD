const express = require('express'),
      app = express(),
      expressSanitizer = require('express-sanitizer'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
    //   http = require('http'),
      methodOverride =require('method-override');


const url = process.env.DATEBASEURL || 'mongodb://localhost/restful_blog_app';
//App Config
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

//Mongoose/model Config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

const Blog = mongoose.model('Blog', blogSchema);

//RESTful routes

app.get('/', function(req, res) {
    res.redirect('/blogs');

});

app.get('/blogs', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log(`Error!`);
        } else {
            res.render('index', {blogs: blogs}); 
        }
    })
});

//New Route
app.get('/blogs/new', function(req, res) {
    res.render('new');
});

//Create Route
app.post('/blogs', function(req, res) {
    req.body.blog.body;
    Blog.create(req.body.blog, function(err, newBLog) {
        if(err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });
});

//Show Route
app.get('/blogs/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: foundBlog});
        }
    });
});

//Edit Route
app.get('/blogs/:id/edit', function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: foundBlog});
        }
    });
});

//Update Route
app.put('/blogs/:id', function(req, res){
    req.body.blog.body;    
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect(`/blogs/${req.params.id}`);
        }
    });
});

//Destroy Route
app.delete('/blogs/:id', function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');            
        }
    });
});

//Server config

app.listen(process.env.PORT, process.env.IP, function() {
    console.log(`Servers is listening`);
})