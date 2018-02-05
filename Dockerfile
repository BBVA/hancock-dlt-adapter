FROM node:7.4.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install --production

EXPOSE 3000

ENTRYPOINT ["npm", "start"]