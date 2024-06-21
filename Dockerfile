FROM node:18

RUN useradd -ms /bin/bash labeling-frontend

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN chown -R labeling-frontend:labeling-frontend /app

ENV PORT=3001

EXPOSE 3001

USER labeling-frontend

CMD ["sh", "-c", "PORT=3001 npm run start"]
