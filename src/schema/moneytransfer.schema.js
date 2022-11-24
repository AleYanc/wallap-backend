export const moneyTransferSchema = {
  type: "object",
  required: ["originAccount", "destinyAccount", "concept", "amount"],
  properties: {
    originAccount: {type: "integer"},
    desintyAccount: {type: "integer"},
    amount: {type: "number"},
    concept: {type: "string", minLength: 3}
  },
  additionalProperties: false
}
