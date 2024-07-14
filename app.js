const express = require('express');
var db = require('./data');
var cors = require('cors')
const blogModel = require('./models/blog');
const uuid = require("uuid");
const app = express();

app.use(express.json());
app.use(cors({
    origin: "*"
}));
const _db = new db();



app.get('/getAllBlog', async (req, res) => {
    res.send(await _db.getAllBlogs());
});
app.get('/SearchBlogs/:keyword', async (req, res) => {
    res.send(await _db.searchBlog(req.params.keyword));
});


app.post('/AddBlog', async (req, res) => {
    let model = new blogModel();
    model.id = uuid.v4().toString();
    model.title = req.body.title;
    model.content = req.body.content;
    model.addToDate = Date();
    await _db.addBlog(model);
    res.json("blog başarılı bir şekilde eklendi.");
});

app.put('/updateBlog', async (req, res) => {
    let model = new blogModel();
    model.id = req.body.id;
    model.title = req.body.title;
    model.content = req.body.content;
    await _db.updateBlog(model);
    res.json("blog başarılı bir şekilde güncellendi");
});

app.delete('/remove/:id', async (req, res) => {
    await _db.removeBlog(req.params.id);
    res.json("blog başarılı bir sekilde silindi");
});

app.get('/getBlog/:id', async (req, res) => {
    res.json(await _db.getByIdBlog(req.params.id));
});



app.listen(3000, () => {
    console.log("dinleniyor");
});