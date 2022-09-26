# sing-me-a-song

The goal of this project was to learn about testing - unit tests, integration tests and end-to-end tests.

## Description

The app itself is a music recommendation app. You can see other people's music recommendations, upvote or downvote them, and add your own.

## How to run it?
### Prerequisites
- In order to run this, you must have a stable version of node (16.17, preferably), and postgreSQL installed in your computer.

### Cloning and installing dependencies
- To clone the project and install the required dependencies, open your terminal and run the following commands in order
```bash
git clone https://github.com/pgeovany/sing-me-a-song && cd sing-me-a-song/
```
```bash
(cd back-end/ && npm i) && (cd front-end/ && npm i)
```

### Setting up environment variables
#### Back-end
- In order to properly run the tests, you will need a .env.test file in the back-end directory with the following content:
```
PORT=5000
DATABASE_URL='postgres://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME'
NODE_ENV='test'
```
Make sure to edit the postgres database url to add your credentials; and as for the port number, you can use any port you want, just make sure to use the same one in the front-end .env file later on.
  
#### Front-end
- In order to connect to the back-end, you will need a .env file in the front-end directory with the following content:

```
REACT_APP_API_BASE_URL=http://localhost:5000
```

## Tests
### Unit tests
 - In order to run the unit tests, go to the back-end directory and run the following command:
 ```
 npm run test:unit
 ```
### Integration tests
 - In order to run the integration tests, go to the back-end directory and run the following command:
 ```
 npm run test:integration
 ```
### End-to-end tests
- In order to run the end-to-end tests, start the back-end server with `npm run dev`, then start the front-end app with `npm run start` and finally run the following command to open the cypress interface:
```
npx cypress open
```
