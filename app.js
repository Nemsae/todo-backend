const PORT = 8000;

//  REQUIRES
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');
const ToDo = require('./models/todo');

//  APP DECLARATION
const app = express();

//  GENERAL MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('build'));

//  WEBPACK CONFIGURATION
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath, noInfo: true
}));
app.use(webpackHotMiddleware(compiler));

//  ______________________________ROUTES______________________________//

//  GET all tasks or GET by completion
app.get('/todos/', (req, res) => {
  let query = req.query;
  console.log('query: ', query);

  if (Object.keys(query).length === 0) {
    console.log('Sanity1');
    ToDo.getAll((err, tasks) => {
      if (err) {
        return res.status(400).send(err);
      }
      res.send(tasks);
    });
  } else {
    console.log('Sanity0');
    ToDo.getByCompletion(query, (err, sortedTasks) => {
      if (err) return res.status(400).send(err);

      res.send(sortedTasks);
    });
  }
});

//  PUT to toggle completion
app.put('/todos/:id/', (req, res) => {
  let id = req.params.id;
  console.log('id: ', id);
  ToDo.updateTask(id, (err, updatedTasks) => {
    if (err) return res.status(400).send(err);

    res.send(updatedTasks);
  });
});

//  DELETE by Completion
app.delete('/todos/complete', (req, res) => {
  ToDo.deleteCompletedTasks((err, uncompletedTasks) => {
    if (err) return res.status(400).send(err);

    res.send(uncompletedTasks);
  });
});

//  DELETE by ID
app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;

  ToDo.deleteTask(id, (err, undeletedTasks) => {
    if (err) return res.status(400).send(err);

    res.send(undeletedTasks);
  });
});

//  POST
app.post('/todos/', (req, res) => {
  ToDo.create(req.body, (err) => {
    if (err) return res.status(400).send(err);

    res.send();
  });

  res.send('Added new task!\n');
});

//  SERVER LISTEN
app.listen(PORT, (err) => {
  console.log(err || `Express listening on port ${PORT}`);
});
