FROM node:8.6.0-stretch

LABEL maintainer="support@byteark.com"

COPY --chown=node ["package.json", "package-lock.json", "/app/"]

USER node
WORKDIR /app
RUN npm install

COPY --chown=node . /app/

EXPOSE 3000
VOLUME [ "/app/storage" ]
CMD [ "npm", "run", "start" ]
