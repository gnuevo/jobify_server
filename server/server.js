var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Job} = require('./models/job');

const {ObjectID} = require('mongodb');


var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.options('/*', function(req, res){
  console.log("OPTIONS--");
  // console.log(req);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.status(200).send();
});

app.post('/jobs', (req, res) => {
    console.log("POST /jobs");
    var job = new Job(req.body);

    job.save().then((doc) => {
      console.log("Success saving");
      res.send(doc);
    }, (e) => {
      console.log("Error saving");
      res.status(400).send(e);
    });
});

app.get('/jobs', (req, res) => {
  console.log("GET /jobs");
  Job.find({}).then((jobs) => {
    res.send({jobs});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/jobs/:jobid', (req, res) => {
  var jobId = req.params.jobid;
  Job.find({ id: jobId }).then((job) => {
    // console.log(job);
    if (job.length == 0) {
      return res.status(404).send();
    }
    res.status(200).send(job[0]);
  });
});

app.delete('/jobs/:jobid', (req, res) => {
  console.log("Delete", req.params.jobid);
  var jobId = req.params.jobid;
  Job.findOneAndRemove({ id: jobId }).then((job) => {
    res.status(200).send(job);
  });
});

app.put('/jobs/:jobid', (req, res) => {
  console.log("Update", req.params.jobid);
  var jobId = req.params.jobid;
  var update_value = req.body;
  Job.findOneAndUpdate({ id: jobId }, update_value).then((job) => {
    if (!job) {
      res.status(400).send({ message: `Element ${jobId} not found!` });
    }
    res.status(200).send(job);
  }, (e) => {
    res.status(400).send(e);
  });
});

// app.get('/todos', (req, res) => {
//     Todo.find().then((todos) => {
//         res.send({todos});
//     }, (e) => {
//         res.status(400).send(e);
//     });
// });
//
// app.get('/todos/:id', (req, res) => {
//   var id = req.params.id;
//   if (!ObjectID.isValid(id)) {
//     res.status(404).send();
//   }
//
//   Todo.findById(id).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }
//     res.status(200).send({todo});
//   }, (e) => {
//     res.status(400).send();
//   });
// });

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};
