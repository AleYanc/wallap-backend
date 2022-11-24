export const investmentsSchema = {
  type: "object",
  required: ["accountId", "amount"],
  properties: {
    accountId: {type: "integer"},
    amount: {type: "number"}
  },
  additionalProperties: false
}
