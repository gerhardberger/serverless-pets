const qs = require('querystring')
const AWS = require('aws-sdk')

const { succeed, fail } = require('../utils')
const DogDB = require('./db')

const db = new AWS.DynamoDB.DocumentClient()

const dogdb = new DogDB(db)

module.exports.create = (event, context, callback) => {
  const params = qs.parse(event.body)

  return dogdb.create(params)
    .then(cat => callback(null, succeed({ cat })))
    .catch(err => callback(null, fail(err)))
}

module.exports.list = (event, context, callback) => {
  return dogdb.list()
    .then(cat => callback(null, succeed(cat)))
    .catch(err => callback(null, fail(err)))
}

module.exports.find = (event, context, callback) => {
  return dogdb.find(event.pathParameters.id)
    .then(cat => callback(null, succeed(cat)))
    .catch(err => callback(null, fail(err)))
}

module.exports.update = (event, context, callback) => {
  callback(null, fail({ message: 'Not implemented!' }))
}

module.exports.deleteOne = (event, context, callback) => {
  callback(null, fail({ message: 'Not implemented!' }))
}
