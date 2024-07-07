import Joi from 'joi';

const parkingSpotCreationSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
})
  .required()
  .unknown(false);

const parkingSpotUpdateSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
})
  .required()
  .unknown(false);

export { parkingSpotCreationSchema, parkingSpotUpdateSchema };
