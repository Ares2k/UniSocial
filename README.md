# UniSocial
A social platform built to help university students connect via mutual interests/hobbies and features an integrated chat.

## Demo
Live application deployed on heroku: [http://unisocial.ie](http://unisocial.ie)

## Tech/framework used
* ReactJS
* NodeJS
* ExpressJS
* MongoDB
* JWT
* Amazon S3
* Socket.io

## Installation
#### Configure Environment Variables
```
PORT=
MONGO_URL=
TOKEN_SECRET=
REFRESH_TOKEN=
AWS_BUCKET=
AWS_BUCKET_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

#### Client
```
cd Client
npm install
npm start
```

#### Server
```
cd Server
npm install
node server.js
```

#### Socket
```
cd Socket
npm install
node index.js
```
