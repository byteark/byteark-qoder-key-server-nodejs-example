FROM node:8.6.0-stretch

LABEL maintainer="support@byteark.com"

COPY ./ /home/node/

EXPOSE 3000
VOLUME [ "/home/node/storage/keys" ]
WORKDIR /home/node

USER 1000:1000

RUN npm install
CMD [ "npm", "run", "start" ]
