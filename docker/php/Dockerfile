FROM php:8.3-fpm-alpine

# Install dependencies sistem yang dibutuhkan untuk PostgreSQL & compile PECL extension
RUN apk add --no-cache \
    libpq-dev \
    linux-headers \
    $PHPIZE_DEPS \
    && docker-php-ext-install pdo pdo_pgsql pdo_mysql \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del $PHPIZE_DEPS \
    && rm -rf /tmp/pear

# Salin Composer resmi versi terbaru
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory ke /var/www/html
WORKDIR /var/www/html

# Port default PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
