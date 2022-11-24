// Import AJV validator factory
import { validatorFactory } from './validator'

// Import user schema
import { userSchema } from '../schema/user.schema'

// Define custom constants
export const VALID_ID_TYPES = ['DNI', 'PASSPORT']

// Validate ID types
export const invalidIdType = (idType) => {
  return VALID_ID_TYPES.includes(idType)
}

// Parse errors
export const parseError = async (validationErrors) => {
  let errors = [];
  validationErrors.forEach(error => {
    errors.push({
      "Missing parameter": error.params["missingProperty"],
      "Key": error.keyword,
      "Message": error.message,
      "Property": (function() {
        return error.keyword === 'minimum' ? error.dataPath : undefined
      })
    })
  });
  return errors
}
