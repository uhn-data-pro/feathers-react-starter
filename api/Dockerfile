FROM node:18

WORKDIR /home/node

COPY --chown=node:node package.json yarn.lock /home/node/
USER node
RUN yarn install

ENV PORT=8000 UPLOAD_ROOT=/home/node/uploads FILEBEAT_ROOT=/home/node/uploads/filebeat_logs

COPY --chown=node:node . /home/node

VOLUME $UPLOAD_ROOT
VOLUME $FILEBEAT_ROOT

USER node
EXPOSE $PORT

CMD [ "yarn", "run", "start" ]
