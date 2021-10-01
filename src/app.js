require('dotenv').config();

const express = require('express');
const app = express();
// const fetch = require('node-fetch');
const redis = require('redis');
const { redis_port } = require('./config.js');

const client = redis.createClient(redis_port);

function setResponse(username, repos) {
  return `<h2>${username} has ${repos} Github repos</h2>`;
}

async function getRepos(req, res, next) {
  try {
    console.log('Fetching data........');

    const { username } = req.params;

    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();

    const repos = data.public_repos;

    // Set data to Redis
    client.setex(username, 3600, repos);

    res.send(setResponse(username, repos));
    res.status(200).json({ username });
  } catch (err) {
    console.error(err.name);
    res.status(500).json({ error: err.message });
  }
}

// Cache middleware
function cache(req, res, next) {
  const { username } = req.params;

  client.get(username, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(setResponse(username, data));
    } else {
      next();
    }
  });
}

app.get('/repos/:username', cache, getRepos);
app.get('/', (req, res, next) => {
  res.status(200).json('hi');
});
module.exports = app;
