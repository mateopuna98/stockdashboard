FROM node:22-alpine

WORKDIR ./server

COPY package*.json ./
COPY . .

RUN npm install


CMD ["npm", "run", "start"]