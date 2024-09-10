FROM node:18.18.0

WORKDIR /home/node
COPY --chown=node:node package.json yarn.lock /home/node/
USER node
RUN yarn install

COPY --chown=node:node . /home/node

ENV PORT=8000 STATIC_ROOT=/home/node/dist

VOLUME $STATIC_ROOT

USER node

EXPOSE $PORT

CMD [ "node", "bin/www" ]
