FROM node:alpine
WORKDIR /app

ENV TZ=Asia/Colombo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN npm install -g depcheck typescript
RUN apk add curl
