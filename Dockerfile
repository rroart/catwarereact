FROM node:12
MAINTAINER <rroart@gmail.com>
ARG catwarecoreserver
ENV CORECATWARESERVER = ${catwarecoreserver}
ENV NPM_CONFIG_LOGLEVEL warn
RUN mkdir /app
WORKDIR /app
COPY . .
WORKDIR /app/webr
RUN npm install -g http-server
RUN npm install
RUN npm run build
WORKDIR /app/webr/docroot

CMD CORECATWARESERVER=${CORECATWARESERVER} http-server -p 80