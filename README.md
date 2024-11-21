# Real-Time Stock Dashboard

Real-time stock market dashboard that displays stock prices and updates them periodically. The application is built with Node.js for the backend, a frontend with React.js, and it utilizes SQL for data management. 

I am using this project to showcase my knowledge in full-stack development using the aforementioned stack.

## Setup

### Start the app

To run the app, you must navigate to the main directory, `stockdashboard/`, and run `docker compose up`

I recommend running the expanded version `docker compose up --build --force-recreate` if you'll run the app several times.

That will start both the server and the client, which you can start using in `http://localhost:3000/`

### Stopping 

To stop cleanly, use `docker compose down` from the same directory where you started it. 

## Project Structure

The project has two main components, dashboard (frontend) and server (backend).

The dashboarh is built with the Create React App framework.

The server is an expressJS server that has some routing endpoints and also manages a websocket connection with the client. 

I use PostgreSQL for the database. During the server initialization I insert a list of hardcoded stocks, and I make operations over them. this to simulate how a Stocks API would behave. 


