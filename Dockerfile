FROM node:16-alpine as build-image

WORKDIR /app

RUN apk add --no-cache make gcc g++ python3

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production

COPY --from=build-image /app/dist ./dist
COPY --from=build-image /app/db ./db

CMD [ "yarn", "start" ]
