// AJV, keywords and formats setup
import Ajv from "ajv";
import { inspect } from "util";
const ajv = new Ajv({ allErrors: true });
require("ajv-keywords")(ajv)
const addFormats = require("ajv-formats")
addFormats(ajv)

// Validator setup
export const validatorFactory = (schema) => {
  const validate = ajv.compile(schema);

  const verify = (data) => {
    const isValid = validate(data);

    const errors = []
    validate.errors?.forEach(error => {
      errors.push(`${error.instancePath.replace('/', '')} ${error.message}`)
    })

    const error_message = errors.join('  --  ')

    if (isValid) {
      return {valid: true}
    } else {
      return {valid: false, message: error_message}
    }
  };

  return { schema, verify };
};
