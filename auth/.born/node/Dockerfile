FROM node:alpine
WORKDIR /app

ARG TZ
ENV TZ=Asia/Colombo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN npm install -g nodemon flow-bin

EXPOSE 3000


