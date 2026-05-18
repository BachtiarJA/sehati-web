FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Aktifkan baris di bawah jika proyek web Anda memerlukan proses kompilasi/build
# RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
