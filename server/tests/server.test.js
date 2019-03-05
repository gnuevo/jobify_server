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
  title: "Cool job",
  company: "Cool company",
  description: "Oh, this job is really cool"
},
{
  _id: new ObjectID(),
  id: "glassdoor:2",
  platform: "glassdoor",
  jobUrl: "<url>",
  title: "Cool job 2",
  company: "Cool company 2",
  description: "Oh, this job is really cool 2"
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
      title: "Cool job:new_job",
      company: "Cool company:new_job",
      description: "Oh, this job is really cool:new_job"
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

describe('GET /jobs', () => {
  it('should retrieve all jobs', (done) => {
    request(app)
    .get('/jobs')
    .expect(200)
    .expect((res) => {
      expect(res.body.jobs.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /jobs/:jobid', () => {
  it('should retrieve an existing job', (done) => {
    var index = 0;
    request(app)
    .get(`/jobs/${jobs[index].id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.id).toBe(jobs[index].id);
      expect(res.body._id).toBe(jobs[index]._id.toHexString());
    })
    .end(done);
  });

  it('should return 404 because the job doesn\'t exist', (done) => {
    var false_id = "superjobs:123";
    request(app)
    .get(`/jobs/${false_id}`)
    .expect(404)
    .end(done);
  });
});

describe('DELETE /jobs/:jobid', () => {
  it('should retrieve an existing job', (done) => {
    var index = 0;
    request(app)
    .delete(`/jobs/${jobs[index].id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.id).toBe(jobs[index].id);
      expect(res.body._id).toBe(jobs[index]._id.toHexString());
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Job.find({ id: jobs[index].id }).then((jobs) => {
        expect(jobs.length).toBe(0);
        done();
      }).catch((e) => done(e))
    });
  });
});
