FROM node:12
MAINTAINER <rroart@gmail.com>
ARG catwarecoreserver
ENV NPM_CONFIG_LOGLEVEL warn
ENV CORECATWARESERVER = ${catwarecoreserver}
RUN mkdir /app
WORKDIR /app
COPY . .
WORKDIR /app/webr
RUN npm install -g http-server
RUN npm install
RUN npm run build
WORKDIR /app/webr/docroot

CMD http-server -p 80