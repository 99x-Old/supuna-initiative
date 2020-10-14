ARG PHP_VERSION
FROM php:${PHP_VERSION}-fpm
WORKDIR /app

ARG TZ
RUN echo -e "[0;32mTimezone set to $TZ[0m"

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# make sure apt is up to date
RUN apt-get update --fix-missing
RUN apt-get install -y curl
RUN apt-get install -y build-essential libssl-dev zlib1g-dev libpng-dev libjpeg-dev libfreetype6-dev

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

RUN docker-php-ext-install pdo pdo_mysql mysqli

EXPOSE 9000

