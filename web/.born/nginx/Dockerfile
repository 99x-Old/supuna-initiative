ARG NGINX_VERSION
FROM nginx:${NGINX_VERSION}
WORKDIR /app

ARG TZ
RUN echo -e "[0;32mTimezone set to $TZ[0m"
RUN apk add curl

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ARG PORT
EXPOSE $PORT
