FROM node:19-alpine3.16

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY ./index.js ./

CMD ["npm","start"]