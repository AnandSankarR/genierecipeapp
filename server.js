var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require("body-parser"); 
var port = 3000;
let jsonData = require('./data/recipes.json');


app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", __dirname + "/views"); 

app.listen(port,function(){
 console.log('Express app listening on port ' + port);
});


app.get('/', (req,res) => {
    let recipes = jsonData;
    console.log(recipes);
    res.render("index", {recipes: recipes});
});

app.get('/search', function(req, res){
    console.log("Searching for recipes");
    if(req.query.squery) {
        //res.send("Return a list of recipes with name: " + req.query.squery); 
        let recipes = jsonData;
        var new_recipes = [];
        Object.keys(recipes).forEach( function(key) {
            console.log(recipes[key] + " === " + req.query.squery);
            if(recipes[key].squery.toLowerCase().includes(req.query.squery.toLowerCase())) {
                new_recipes.push(recipes[key]);
            } 
        });
        console.log(new_recipes);
        res.render("index", {recipes: new_recipes});
    }else {
        res.render("index", {recipes: jsonData});
    }
});

app.get('/recipes/:id', function(req, res){
    console.log("return recipe with the ID:" + req.params.id);
    res.send("return recipe with the ID:" + req.params.id);
});

app.get('/add', function(req,res) {
    console.log("Add recipe");
    res.render("addRecipe");
});

app.post('/add', function(req,res){
    console.log("Adding new recipe: "+ req.body.rname);
    let new_recipe = {
        name: req.body.rname,
        desc: req.body.desc,
        vurl: req.body.vurl,
        ninfo: req.body.ninfo,
        img: req.body.image,
        squery: req.body.squery
    }
    fs.readFile('./data/recipes.json', function(err,data) {
        if(err) throw err;
        let json = JSON.parse(data);
        json.push(new_recipe);
        console.log(json);
        fs.writeFile("./data/recipes.json", JSON.stringify(json), function(err) {
            if(err) throw err;
            console.log('Done!');
        });
    });
});