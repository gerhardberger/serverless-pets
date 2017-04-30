const Joi = require('joi')

module.exports = {
  create: Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    breed: Joi.string().required(),
    age: Joi.number().integer().required()
  })
}
