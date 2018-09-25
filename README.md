# example-arduino-server

## Prerequisites
 - NodeJS installed [nodejs.org](https://nodejs.org)
 - Git installed [Git](https://git-scm.com/)

## Installing

 - `git clone https://github.com/rdfriedl/example-arduino-server.git`
 - `cd example-arduino-server`
 - Then run `npm install` in the directory

## Running the server

To run the server, run the command `npm start` in the directory. 

It should start a local server at [localhost:8000](http://localhost:8000)

## Posting the arduino status

Once the server is running send a http POST request to `/status` or (`<server-ip>:8000/status`) with the `Content-Type: application/json` header and some JSON as the body
```
{
  "id": "arduino-1",
  "status": "awake",
  "active": true
}
```
The only requirement is that the JSON has to have the `id` property.
