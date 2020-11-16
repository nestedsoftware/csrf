'use strict';

const { v1: uuidv1 } = require('uuid');
const path = require('path');
const express = require('express');

const sessionHandler = require('./sessionHandler');

const app = express();
const port = 80;

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(sessionHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/form', (req, res) => {
  console.log({ url: req.url, method: req.method, headers: req.headers });
  res.render('simple_form', {csrfToken: req.session.csrfToken});
});

app.get('/form_no_embedding', (req, res) => {
  console.log({ url: req.url, method: req.method, headers: req.headers });
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('Content-Security-Policy', "frame-ancestors 'self'");
  res.render('simple_form', {csrfToken: req.session.csrfToken});
});

app.post('/save', (req, res) => {
  console.log({ url: req.url, method: req.method, headers: req.headers });
  console.log('session id: ', req.session.sessionId);
  console.log('name form field: ', req.body.name);
  console.log('received csrfToken: ', req.body.csrfToken);
  console.log('session csrfToken:  ', req.session.csrfToken);
  if (!req.body.csrfToken || req.body.csrfToken !== req.session.csrfToken) {
    console.log('CSRF verification failed');
    res.status(403).send('CSRF verification failed');
  } else {
    console.log('CSRF verification succeeded');
    res.status(200).send('Form processed successfully');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

