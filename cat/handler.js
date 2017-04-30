const qs = require('querystring')
const AWS = require('aws-sdk')

const { succeed, fail } = require('../utils')
const CatDB = require('./db')

const db = new AWS.DynamoDB.DocumentClient()

const catdb = new CatDB(db)

module.exports.create = (event, context, callback) => {
  const params = qs.parse(event.body)

  return catdb.create(params)
    .then(cat => callback(null, succeed({ cat })))
    .catch(err => callback(null, fail(err)))
}

module.exports.list = (event, context, callback) => {
  return catdb.list()
    .then(cat => callback(null, succeed(cat)))
    .catch(err => callback(null, fail(err)))
}

module.exports.find = (event, context, callback) => {
  return catdb.find(event.pathParameters.id)
    .then(cat => callback(null, succeed(cat)))
    .catch(err => callback(null, fail(err)))
}

module.exports.update = (event, context, callback) => {
  callback(null, fail({ message: 'Not implemented!' }))
}

module.exports.deleteOne = (event, context, callback) => {
  callback(null, fail({ message: 'Not implemented!' }))
}
