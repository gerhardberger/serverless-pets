const test = require('ava')
const AWS = require('aws-sdk')

const service = new AWS.DynamoDB({
  region: 'us-east-1',
  endpoint: 'http://localhost:3001',
  params: { TableName: 'Dogs' },
  httpOptions: { timeout: 5000 }
})

const db = new AWS.DynamoDB.DocumentClient({ service })

const DogDB = require('./db')

const tableConfig = {
  TableName: 'Dogs',
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

const dogData = {
  name: 'zsomi',
  breed: 'labrador',
  age: 25
}

const dogData2 = {
  name: 'zsomike',
  breed: 'labrador retriever',
  age: 27
}

test.cb.beforeEach(t => {
  service.deleteTable({ TableName: 'Dogs' }, err => {
    if (err) return console.error(err)
    service.createTable(tableConfig, err => {
      if (err) return console.error(err)
      t.end()
    })
  })
})

test('dog.create not valid', t => {
  const dogdb = new DogDB(db)

  return t.throws(dogdb.create(Object.assign({}, dogData, { breed: 123 })))
})

test('dog.create valid', t => {
  const dogdb = new DogDB(db)

  return dogdb.create(dogData).then(dog => {
    t.is(dog.name, dogData.name)
    t.is(dog.age, dogData.age)
  })
})

test('dog.list empty', t => {
  const dogdb = new DogDB(db)

  return dogdb.list().then(dogs => {
    t.is(dogs.length, 0)
  })
})

test('dog.list with items', t => {
  const dogdb = new DogDB(db)

  return dogdb.create(dogData)
    .then(() => dogdb.create(dogData2))
    .then(() => dogdb.list())
    .then(dogs => t.is(dogs.length, 2))
})

test('dog.find existing', t => {
  const dogdb = new DogDB(db)

  let added

  return dogdb.create(dogData)
    .then(dog => {
      added = dog
      return dogdb.find(dog.id)
    })
    .then(dog => t.is(dog.id, added.id))
})

test('dog.find not existing', t => {
  const dogdb = new DogDB(db)

  return t.throws(dogdb.find('asd'))
})
