export const accountSchema = {
  type: "object",
  required: ["userId"],
  properties: {
    userId: { type: "integer", minLength: 1 },
    balance: {type: "float"},
    currency: {type: "string", maxLength: 3}
  },
  additionalProperties: false
}
