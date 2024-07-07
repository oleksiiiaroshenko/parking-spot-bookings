import Joi from 'joi';

const bookingCreationSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  parkingSpotId: Joi.number().integer().positive().required(),
  startDateTime: Joi.date().required(),
  endDateTime: Joi.date().required(),
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
})
  .required()
  .unknown(false);

const bookingUpdateSchema = Joi.object({}).required(); // todo

export { bookingCreationSchema, bookingUpdateSchema };
