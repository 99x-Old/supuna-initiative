FROM node:alpine
WORKDIR /app

ENV TZ=Asia/Colombo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apk add curl

RUN npm install -g nodemon

RUN apk add --update --no-cache \
    python \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev

EXPOSE 3000


