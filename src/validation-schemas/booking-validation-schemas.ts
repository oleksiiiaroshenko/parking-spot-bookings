import Joi from 'joi';

export const bookingCreationSchema = Joi.object({
  parkingSpotId: Joi.number().integer().positive().required(),
  startDateTime: Joi.date().required(),
  endDateTime: Joi.date().required().greater(Joi.ref('startDateTime')).messages({
    'date.greater': 'End date must be greater than start date',
  }),
})
  .required()
  .unknown(false);

export const bookingUpdateSchema = Joi.object({
  endDateTime: Joi.date().required(),
})
  .required()
  .unknown(false);
