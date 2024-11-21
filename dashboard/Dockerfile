FROM node:22-alpine

WORKDIR ./dashboard
COPY package*.json ./
COPY . .

RUN npm install

CMD ["npm", "start"]