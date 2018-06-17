import { MongoClient } from 'mongodb';

export class Database {

  private uri: string;
  private db: any;

  constructor(uri: string) {
    this.uri = uri;
    this.db = {};
    return this;
  }

  public connect(database: string) {
    return new Promise((resolve, reject) => {
      console.log('mongo url =>', this.uri);
      MongoClient.connect(this.uri, (err, db) => {
        if (err) { reject(err); }
        this.db = db.db(database);
        return resolve(this);
      });
    });
  }

  public get() {
    return this.db;
  }

  public close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err: any) => {
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
