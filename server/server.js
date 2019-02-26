var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Job} = require('./models/job');

const {ObjectID} = require('mongodb');


var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


app.post('/jobs', (req, res) => {
    console.log(req.body);
    var job = new Job(req.body);

    job.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});


app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};
