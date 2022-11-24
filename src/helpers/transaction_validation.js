

// Check body request for missing params
export const missingParam = (body, schema) => {
  const missingParamValidation = validatorFactory(schema)
  const data = missingParamValidation.verify(body)
  return data
}
