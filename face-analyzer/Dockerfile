FROM node:20

# ENV NODE_ENV=production

WORKDIR /app

RUN npm install -g serve

COPY package.json .

RUN npm install

# RUN npm install --production

COPY . .

RUN mv *.vlc public/

RUN npm run build

EXPOSE 3000

CMD serve -ns build -l 3000
