FROM node:10
ENV NODE_ENV="production"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY app app
COPY server server

VOLUME ./logs

ENV PORT=80
ENV LOG_PATH="/logs"
EXPOSE 80

CMD [ "npm", "start" ]
