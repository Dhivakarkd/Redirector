FROM node:19-alpine3.16

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN apk add curl

COPY . .

CMD ["npm", "start"]
