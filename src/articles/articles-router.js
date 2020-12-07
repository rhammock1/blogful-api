const express = require('express');
const ArticlesService = require('./articles-service');
const xss = require('xss');
const articlesRouter = express.Router();
const jsonParser = express.json();

articlesRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db')
    ArticlesService.getAllArticles(db)
      .then(articles => {
        // articles.forEach(article => {
        //   xss(article.title);
        //   xss(article.content);
        // })
        res.status(200).json(articles)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, content, style } = req.body;
    xss(title);
    xss(content);
    const newArticle = { title, content, style };
    console.log(newArticle);
    for(const [key, value] of Object.entries(newArticle)) {
      if(value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key} in request body`}
        })
      }
    }
    ArticlesService.insertArticle(
      req.app.get('db'),
      newArticle
    )
      .then(article => {
        res.status(201).location(`${req.originalUrl}/${article.id}`).json(article)
      })
      .catch(next)
  })

  articlesRouter
    .route('/:article_id')
    .all((req, res, next) => {
      const db = req.app.get('db');
      ArticlesService.getById(db, req.params.article_id)
        .then(article => {
          if(!article) {
            return res.status(404).json({
              error: { message: `Article doesn't exist` }
            })
          }
          res.article = article //saves for the next middleware
          next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
          res.status(200).json({
            id: res.article.id, 
            style: res.article.style, 
            title: xss(res.article.title), 
            content: xss(res.article.content), date_published: res.article.date_published
          
        })
        .catch(next)
    })
    .delete((req, res, next) => {
      ArticlesService.deleteArticle(
        req.app.get('db'), 
        req.params.article_id)
        .then(() => {
          res.status(204).end()
        })
        .catch(next)
    })


    module.exports = articlesRouter;