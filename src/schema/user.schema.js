export const userSchema = {
  type: "object",
  required: ["firstName", "lastName", "password", "email", "idType", "idNumber", "phoneNumberPrefix", "phoneNumber", "country"],
  properties: {
    firstName: { type: "string", minLength: 1 },
    lastName: { type: "string", minLength: 1 },
    password: { type: "string", minLength: 8, maxLength: 20 },
    email: { type: "string", format: "email", minLength: 6 },
    idType: { type: "string", minLength: 1 },
    idNumber: { type: "integer", minLength: 1 },
    phoneNumberPrefix: { type: "integer", minLength: 1 },
    phoneNumber: { type: "integer", minLength: 1 },
    country: { type: "string", minLength: 1 }
  },
  additionalProperties: false
}
