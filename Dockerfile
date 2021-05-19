FROM node:10-alpine as base

RUN apk add --no-cache \
        curl \
        git \
    && npm install -g gulp bower \
    && mkdir /app \
    && chown -R node:node /app

WORKDIR /app

USER node

COPY --chown=node:node bower.json package.json package-lock.json ./

RUN npm install \
    && bower install

# dev
FROM base as dev

COPY --chown=node:node ./gulpfile.js ./
COPY --chown=node:node ./gulp/ ./gulp/

ENV PATH=/app/node_modules/.bin:$PATH

CMD ["gulp", "serve"]

# source
FROM base as source

COPY --chown=node:node . .

RUN mv ./src/app/index.constants.js.sample ./src/app/index.constants.js \
    && mv ./oauth/config.js.sample ./oauth/config.js

# build
FROM source as build

RUN gulp build

# runtime
FROM nginx:1.19.1-alpine as runtime

LABEL maintainer="Carlos Remuzzi cremuzzi@agetic.gob.bo"
LABEL org.label-schema.description="Frontend del sistema de plantillas de AGETIC"
LABEL org.label-schema.name="plantillas-frontend"
LABEL org.label-schema.schema-version="1.0"
LABEL org.label-schema.vcs-url="https://gitlab.softwarelibre.gob.bo/agetic/plantillas/plantillas-frontend"
LABEL org.label-schema.vendor="AGETIC"

ENV BACKEND_URL=http://127.0.0.1:8000

COPY entrypoint.sh /usr/local/bin/entrypoint.sh

COPY --chown=nobody:nobody --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
