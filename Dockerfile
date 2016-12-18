FROM node:7.2

COPY . /opt/app/
WORKDIR /opt/app/
RUN npm install

CMD npm start