const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const ArticlesService = require('./articles-service');
require('dotenv').config();

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/articles', (req, res, next) => {
  const db = req.app.get('db')
  ArticlesService.getAllArticles(db)
    .then(articles => {
      res.status(200).json(articles)
    })
    .catch(next)
});
app.get('/articles/:article_id', (req, res, next) => {
  const db = req.app.get('db');
  ArticlesService.getById(db, req.params.article_id)
    .then(article => {
      res.status(200).json(article)
    })
    .catch(next)
})

app.use(function errorHandler(error, req, res, next) {
  let response;
  if(NODE_ENV === 'production') {
    response = { error: { message: 'Internal Server Error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
})

module.exports = app;
