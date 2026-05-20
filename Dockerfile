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

# 5. Injeksi konfigurasi Nginx secara aman (Baris per baris dengan single quotes)
RUN echo 'server {' > /etc/nginx/http.d/default.conf && \
    echo '    listen 80;' >> /etc/nginx/http.d/default.conf && \
    echo '    root /var/www/html/public;' >> /etc/nginx/http.d/default.conf && \
    echo '    index index.php index.html;' >> /etc/nginx/http.d/default.conf && \
    echo '    location / { try_files $uri $uri/ /index.php?$query_string; }' >> /etc/nginx/http.d/default.conf && \
    echo '    location ~ \.php$ {' >> /etc/nginx/http.d/default.conf && \
    echo '        try_files $uri =404;' >> /etc/nginx/http.d/default.conf && \
    echo '        fastcgi_split_path_info ^(.+\.php)(/.+$);' >> /etc/nginx/http.d/default.conf && \
    echo '        fastcgi_pass 127.0.0.1:9000;' >> /etc/nginx/http.d/default.conf && \
    echo '        include fastcgi_params;' >> /etc/nginx/http.d/default.conf && \
    echo '        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;' >> /etc/nginx/http.d/default.conf && \
    echo '        fastcgi_param PATH_INFO $fastcgi_path_info;' >> /etc/nginx/http.d/default.conf && \
    echo '    }' >> /etc/nginx/http.d/default.conf && \
    echo '}' >> /etc/nginx/http.d/default.conf

# 6. Setel Supervisor secara aman
RUN echo '[supervisord]' > /etc/supervisord.conf && \
    echo 'nodaemon=true' >> /etc/supervisord.conf && \
    echo '[program:php-fpm]' >> /etc/supervisord.conf && \
    echo 'command=php-fpm' >> /etc/supervisord.conf && \
    echo '[program:nginx]' >> /etc/supervisord.conf && \
    echo 'command=nginx -g "daemon off;"' >> /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]