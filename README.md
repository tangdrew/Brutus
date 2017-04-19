# Brutus

## Getting Started
---
Requires at least:
 - NPM 4.4.x
 - Node 2.15.x

Clone the repository
```sh
git clone https://github.com/tangdrew/Brutus.git
```
## MongoDB
Install mongo
```sh
brew install mongodb
```
Make directory where Mongo data lives
```sh
mkdir -p /data/db
```
Make sure `/data/db` has the correct permissions
```sh
sudo chown -R `id -un` /data/db
```
To start Mongo Daemon run command in a terminal window
```sh
mongod
```
You can run the Mongo shell with
```sh
mongo
```
## Rest API
Navigate to [brutus-api](/brutus-api) directory
```sh
cd brutus-api
```
Install Dependencies
```sh
npm install
```
Start Server. Runs on port 4040.
```sh
npm start
```
## Web Client
Navigate to [brutus-web-client](/brutus-web-client) directory
```sh
cd brutus-web-client
```
Install Dependencies
```sh
npm install
```
Start Server (uses live reloading by default). Runs on port 5555.
```sh
npm start
```
The Angular 2 app should start automatically open in your browser.
