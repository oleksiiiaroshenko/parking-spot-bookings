import Joi from 'joi';
import { UserRole } from '../enums';

export const userCreationSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid(UserRole.ADMIN, UserRole.STANDARD).required(),
  token: Joi.string().required(),
})
  .required()
  .unknown(false);

export const userUpdateSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).optional(),
  lastName: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid(UserRole.ADMIN, UserRole.STANDARD).optional(),
  token: Joi.string().optional(),
})
  .or('firstName', 'lastName', 'email', 'role', 'token')
  .required()
  .unknown(false);
