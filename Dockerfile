FROM node:8.9.3
LABEL maintainer "Angel Manzano Alcaraz <angel.manzano.contractor@bbva.com>"

# Move to build dir
WORKDIR /usr/src/app

# Install app dependencies
ADD package*.json ./
ADD yarn.lock ./
RUN yarn cache clean --force
RUN yarn install

ENV NODE_ENV production

# Build the app
COPY . .
RUN yarn run build:ts

EXPOSE 80
EXPOSE 9229
ENTRYPOINT [ "./environment/entry.sh" ]
CMD ["prod"]