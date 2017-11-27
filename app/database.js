'use strict';

const MongoClient = require('mongodb').MongoClient;

export default class Database {

  constructor(uri) {
    this.uri = uri;
    this.db = {};
    return this;
  };

  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.uri, (err, db) => {
        if(err) reject(err);
        this.db = db;
        resolve(this);
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
