FROM php:8.2.30-apache

RUN apt-get update && apt-get install -y libcurl4-openssl-dev && docker-php-ext-install curl && rm -rf /var/lib/apt/lists/*

COPY . /var/www/html/

EXPOSE 80
