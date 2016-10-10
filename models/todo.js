const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const filename = path.join(__dirname, '../data/todolist.json');

exports.getAll = function (cb) {
  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);

    try {
      var data = JSON.parse(buffer);
    } catch (e) {
      data = [];
    }

    cb(null, data);
  });
};

exports.write = function (newData, cb) {
  let json = JSON.stringify(newData);

  fs.writeFile(filename, json, cb);
};

exports.create = function (newItem, cb) {
  exports.getAll((err, items) => {
    if (err) return cb(err);

    newItem.id = uuid();
    newItem.complete = 'false';

    items.push(newItem);

    exports.write(items, cb);
  });
};

exports.getByCompletion = function (query, cb) {
  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);

    let tasks = JSON.parse(buffer);

    let sortedTasks = tasks.filter((task) => {
      if (task.complete === query.complete) {
        return task;
      } else return;
    });

    cb(null, sortedTasks);
  });
};

exports.updateTask = function (id, cb) {
  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);

    let tasks = JSON.parse(buffer);
    let updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        if (task.complete === 'false') {
          task.complete = 'true';
        } else {
          task.complete = 'false';
        }
        return task;
      } else {
        return task;
      }
    });

    exports.write(updatedTasks, cb);
    cb(null, updatedTasks);
  });
};

exports.deleteTask = function (id, cb) {
  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);

    let tasks = JSON.parse(buffer);
    let undeletedTasks = tasks.filter((task) => {
      if (task.id === id) {
        return;
      } else {
        return task;
      }
    });
    exports.write(undeletedTasks, cb);
    cb(null, undeletedTasks);
  });
};

exports.deleteCompletedTasks = function (cb) {
  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);

    let tasks = JSON.parse(buffer);
    let uncompletedTasks = tasks.filter((task) => {
      if (task.complete === 'true') {
        return;
      } else {
        return task;
      }
    });

    exports.write(uncompletedTasks, cb);
    cb(null, uncompletedTasks);
  });
};
