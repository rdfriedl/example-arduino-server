FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

VOLUME ./logs

ENV NODE_PORT=80
ENV LOG_PATH="/logs"
EXPOSE 80

CMD [ "npm", "start" ]