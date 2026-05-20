FROM php:8.2-fpm-alpine

# 1. Install ekstensi PHP beserta tools pendukung kompresi untuk Composer & Nginx
RUN apk add --no-cache nginx supervisor git zip unzip \
    && docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www/html

# 2. Ambil binary composer resmi terbaru
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 3. Salin seluruh source code (Aset frontend dari GitHub Actions otomatis ikut terbawa)
COPY . .

# 4. Jalankan instalasi dependensi tanpa mode development & optimasi autoloader
RUN composer install --no-dev --optimize-autoloader \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 5. Injeksi konfigurasi Nginx untuk membaca public folder Laravel
RUN echo 'server { \
    listen 80; \
    root /var/www/html/public; \
    index index.php index.html; \
    location / { try_files $uri $uri/ /index.php?$query_string; } \
    location ~ \.php$ { \
        try_files $uri =404; \
        fastcgi_split_path_info ^(.+\.php)(/.+)$; \
        fastcgi_pass 127.0.0.1:9000; \
        include fastcgi_params; \
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name; \
        fastcgi_param PATH_INFO $fastcgi_path_info; \
    } \
}' > /etc/nginx/http.d/default.conf

# 6. Setel Supervisor untuk menjaga Nginx & PHP-FPM berjalan beriringan
RUN echo '[supervisord] \n\
nodaemon=true \n\
[program:php-fpm] \n\
command=php-fpm \n\
[program:nginx] \n\
command=nginx -g "daemon off;"' > /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]