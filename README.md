# Jobify Server

Backend for the [jobify extension](https://github.com/gnuevo/jobify).

This is basically a node backend that stores job information in MongoDB.
The server waits for HTTP requests and actualises the DB accordingly.

Usage
-----

To use the project you have to

1. Clone this repo
2. `npm install` dependencies
3. Start MongoDB
4. `npm start`

If everything went well you should be able to receive requests.

Try it manually
---------------

You can easily send some requests from your browser to verify the server is working.

### List all jobs

Enter `localhost:3000/jobs` into your browser's address bar.
This should list all the jobs that are contained in the DB.
You can do the same using the `fetch` API.

```JavaScript
fetch('http://localhost:3000/jobs', {
  method:'GET',
  mode: 'cors'
})
.then(res => {
  res.json().then(data => {
    console.log(data);
});
}).catch(e => console.log(e));
```

### Post new job

To post a new job you can do it using the `fetch` API.
Mind the `body` field.
There you can add the info you want about your test job.
If succeeded, the server will reply with the new saved job.

```JavaScript
fetch('http://localhost:3000/jobs', {
  method:'POST',
  mode: 'cors',
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    id: "10265265",
    platform: "Fairy Jobs",
    jobUrl: "<url>",
    title: "Fairy Manager",
    company: "Fairy Corp",
    description: "We need a new Fairy Manager to do cool fairy stuff."
  })
})
.then(res => {
  res.json().then(data => {
    console.log(data);
});
}).catch(e => console.log(e));
```
