'use strict';

var logger = require('../lib/db_logger');
var Client = require('mariasql');

var Model = function Model() {
  this.result = false;
  this.error = false;

  this.success = function() {};
  this.fail = function() {};
};

Model.prototype.init = function(result, success, fail) {
  this.result = result;
  this.error = false;

  this.success = success;
  this.fail = fail;
};

Model.prototype.setResult = function(result) {
  this.result = result;
};

Model.prototype.addResult = function(result) {
  this.result.push(result);
};

Model.prototype.db = function() {
  var db = new Client();

  //Initiate, connect to DB
  db.connect({
    host: 'cmpe235.ceuvpllmlap3.us-west-2.rds.amazonaws.com',
    port: 3306,
    user: 'cmpe235',
    password: 'testing123',
    db: 'CMPE235'
  });

  db.on('connect', function() {
    logger.debug('Client connected');
  }).on('error', function(error) {
    logger.debug({
      error: error
    }, 'Client error');
  }).on('close', function(hadError) {
    logger.debug('Client closed');
  });
  return db;
};

Model.prototype.logger = function() {
  return logger;
};

Model.prototype.jsonDecode = function(json, defaultValue) {
  if (!defaultValue) {
    defaultValue = {};
  }

  var object = defaultValue;
  try {
    object = JSON.parse(json);
  } catch (e) {}

  return object;
};

Model.prototype.queryError = function(error) {
  logger.debug({ error: error }, 'Query error');

  this.error = error;
};

Model.prototype.queryEnd = function(info) {
  logger.debug({ info: info }, 'Query end');
};

Model.prototype.resultError = function(error) {
  logger.debug({ error: error }, 'Results error');

  this.fail(error);
};

Model.prototype.resultEnd = function() {
  if (this.error) {
    this.fail(this.error);
  } else {
    this.success(this.result);
  }
};

module.exports = Model;
