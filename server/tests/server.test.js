const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Job} = require('./../models/job');

const jobs = [
{
  _id: new ObjectID(),
  id: "glassdoor:1",
  platform: "glassdoor",
  jobUrl: "<url>",
  data: {
    title: "Cool job",
    company: "Cool company",
    description: "Oh, this job is really cool"
  }
},
{
  _id: new ObjectID(),
  id: "glassdoor:2",
  platform: "glassdoor",
  jobUrl: "<url>",
  data: {
    title: "Cool job 2",
    company: "Cool company 2",
    description: "Oh, this job is really cool 2"
  }
}
]

beforeEach((done) => {
    Job.remove({}).then(() => {
        return Job.insertMany(jobs);
    }).then(() => done());
});

describe('POST /jobs', () => {
  it('should create a new job', (done) => {
    var new_job = {
      _id: new ObjectID(),
      id: "glassdoor:new_job",
      platform: "glassdoor",
      jobUrl: "<url>",
      data: {
        title: "Cool job:new_job",
        company: "Cool company:new_job",
        description: "Oh, this job is really cool:new_job"
      }
    };

    request(app)
      .post('/jobs')
      .send(new_job)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(new_job._id.toString());
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Job.find({ id: new_job.id }).then((jobs) => {
          expect(jobs.length).toBe(1);
          expect(jobs[0]._id.toString()).toBe(new_job._id.toString());
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create job with invalid data', (done) => {
    // mind that the id field is missing
    var new_job = {
      _id: new ObjectID(),
      platform: "glassdoor",
      jobUrl: "<url>",
      data: {
        title: "Cool job:new_job",
        company: "Cool company:new_job",
        description: "Oh, this job is really cool:new_job"
      }
    };

    request(app)
      .post('/jobs')
      .send(new_job)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Job.find({ id: new_job.id }).then((jobs) => {
          expect(jobs.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
