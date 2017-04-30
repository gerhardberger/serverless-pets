const hat = require('hat')
const pify = require('pify')
const Joi = pify(require('joi'))

const valid = require('./valid')

module.exports = class DogDB {
  constructor (db) {
    this.db = db
  }

  create (data) {
    const id = hat(32)

    data = Object.assign({}, data, { id })
    return Joi.validate(data, valid.create)
      .then(() => new Promise((resolve, reject) => {
        this.db.put({
          TableName: 'Dogs',
          Item: data
        }, err => {
          if (err) return reject(err)
          resolve(data)
        })
      }))
  }

  list () {
    return new Promise((resolve, reject) => {
      this.db.scan({ TableName: 'Dogs' }, (err, data) => {
        if (err) return reject(err)
        resolve(data.Items || [])
      })
    })
  }

  find (id) {
    return new Promise((resolve, reject) => {
      this.db.query({
        TableName: 'Dogs',
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: { ':id': id }
      }, (err, data) => {
        if (err) return reject(err)

        if (!data.Items || (data.Items.length !== 1)) {
          return reject({ error: 'Could not look up dog' })
        }

        resolve(data.Items[0])
      })
    })
  }
}
