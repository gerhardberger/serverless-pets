const test = require('ava')
const AWS = require('aws-sdk')

const service = new AWS.DynamoDB({
  region: 'us-east-1',
  endpoint: 'http://localhost:3001',
  params: { TableName: 'Cats' },
  httpOptions: { timeout: 5000 }
})

const db = new AWS.DynamoDB.DocumentClient({ service })

const CatDB = require('./db')

const tableConfig = {
  TableName: 'Cats',
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' }
  ],
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  }
}

const catData = {
  name: 'micica',
  breed: 'siamese',
  age: 21
}

const catData2 = {
  name: 'micike',
  breed: 'siamese',
  age: 23
}

test.cb.beforeEach(t => {
  service.deleteTable({ TableName: 'Cats' }, err => {
    if (err) return console.error(err)
    service.createTable(tableConfig, err => {
      if (err) return console.error(err)
      t.end()
    })
  })
})

test('cat.create not valid', t => {
  const catdb = new CatDB(db)

  return t.throws(catdb.create(Object.assign({}, catData, { breed: 123 })))
})

test('cat.create valid', t => {
  const catdb = new CatDB(db)

  return catdb.create(catData).then(cat => {
    t.is(cat.name, catData.name)
    t.is(cat.age, catData.age)
  })
})

test('cat.list empty', t => {
  const catdb = new CatDB(db)

  return catdb.list().then(cats => {
    t.is(cats.length, 0)
  })
})

test('cat.list with items', t => {
  const catdb = new CatDB(db)

  return catdb.create(catData)
    .then(() => catdb.create(catData2))
    .then(() => catdb.list())
    .then(cats => t.is(cats.length, 2))
})

test('cat.find existing', t => {
  const catdb = new CatDB(db)

  let added

  return catdb.create(catData)
    .then(cat => {
      added = cat
      return catdb.find(cat.id)
    })
    .then(cat => t.is(cat.id, added.id))
})

test('cat.find not existing', t => {
  const catdb = new CatDB(db)

  return t.throws(catdb.find('asd'))
})
