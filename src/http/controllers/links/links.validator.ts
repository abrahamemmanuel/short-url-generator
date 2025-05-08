import joi from "joi";

export const isEncodeUrl = joi.object({
  longUrl: joi.string()
    .uri({ scheme: ['http', 'https'] }) // only allow http and https URLs
    .required()
});
