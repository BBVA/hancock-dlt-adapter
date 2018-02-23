'use strict';

const MongoClient = require('mongodb').MongoClient;

class Database {

  constructor(uri) {
    this.uri = uri;
    this.db = {};
    return this;
  };

  connect(database) {
    return new Promise((resolve, reject) => {
    console.log('mongo url =>', this.uri);      
      MongoClient.connect(this.uri, (err, db) => {
        if(err) reject(err);
        this.db = db.db(database);
        return resolve(this);
      });
    });
  };

  get() {
    return this.db;
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  }
}

exports.Database = Database;