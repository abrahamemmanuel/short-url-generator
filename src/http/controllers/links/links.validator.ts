import joi from "joi";

const isValidUrl = joi.string()
.uri({ scheme: ['http', 'https'] }) // only allow http and https URLs
.required();

export const isEncodeUrl = joi.object({
  longUrl: isValidUrl
});

export const isDecodeUrl = joi.object({
  shortUrl: isValidUrl
});

export const isUrlPath = joi.object({
  url_path: joi.string().required()
});
