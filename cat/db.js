const hat = require('hat')
const pify = require('pify')
const Joi = pify(require('joi'))

const valid = require('./valid')

module.exports = class CatDB {
  constructor (db) {
    this.db = db
  }

  create (data) {
    const id = hat(32)

    data = Object.assign({}, data, { id })
    return Joi.validate(data, valid.create)
      .then(() => new Promise((resolve, reject) => {
        this.db.put({
          TableName: 'Cats',
          Item: data
        }, err => {
          if (err) return reject(err)
          resolve(data)
        })
      }))
  }

  list () {
    return new Promise((resolve, reject) => {
      this.db.scan({ TableName: 'Cats' }, (err, data) => {
        if (err) return reject(err)
        resolve(data.Items || [])
      })
    })
  }

  find (id) {
    return new Promise((resolve, reject) => {
      this.db.query({
        TableName: 'Cats',
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: { ':id': id }
      }, (err, data) => {
        if (err) return reject(err)

        if (!data.Items || (data.Items.length !== 1)) {
          return reject({ error: 'Could not look up cat' })
        }

        resolve(data.Items[0])
      })
    })
  }
}
