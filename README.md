# Hotel Booking website 
This project is a hotel booking website, made using Ascendas API for hotels.

## Features 
* Account Features 
    * Create account 
    * Update account 
    * Delete account 
* Search 
    * Destination search 
    * Hotel search 
    * View room details 
* Booking 
    * Book a hotel room 
    * Delete a booking 

## Screenshots of the webpage 
![](/assets/homepage.png)
![](/assets/hotelsearch.png)
![](/assets/room.png)
![](/assets/booking.png)
![](/assets/displaybookings.png)
![](/assets/register.png)
![](/assets/login.png)
![](/assets/profile.png)

## Technologies used 
![React](https://shields.io/badge/react-black?logo=react&style=for-the-badge)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Testing-Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)
![cypress](https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

The main website is rendered with React, with all the processing in the controllers and models done on an Express server. The Express server also calls an external API provided by Ascendas for all the hotel information. We are storing user information, booking data and other necessary data with a MySQL database. 

The project has been tested extensively with Jest, React testing library and Cypress, more details below. 

### How we are storing passwords 

To support the login feature, we used bcrypt, which uses a modified Blowfish encryption algorithm to perform password hashing. 

# Getting Started 

## Project Structure 

- `frontend/` - contains React frontend components 
- `backend/` - contains backend done with Express.js 

The backend serves the information when the specific API route is called. React will call the API to get the relevant information and package that in a nice UI. 

## Install dependencies 

- cd into `frontend` or `backend` 
- run `npm install`

All configurations are defined in `package.json` in the respective directories, including the modifications to commands like `npm install` or `npm start`. The dependency version number is defined in `package-lock.json`. 

### Start Express backend 

```bash
npm start 
```

This will start the server and also `nodemon` will listen for any changes upon save and reload the server automatically. `dotenv` package is used to load environment variables in the `.env` file, placed on the same level as the `.env.test` file. The environment variables has the same key but the values have been omitted for safety reasons. 

## Start React frontned 

```bash
npm start 
```

This launches the React server, which listens for any changes upon save and will automatically reload the webpage with the new changes. 

# Testing 
We have done extensive unit, integration and system testing for the whole application. 

## Unit Testing 

Individual components were tested in isolation using Jest for backend functions and React testing library for testing components. Unit tests were done for both frontend and backend functions. 

## Integration Testing 
We conducted bottom up integration testing by first identifying the bottom most leaf functions, then running tests progressively from the leaf all the way to the top most node or function. 

## System Testing 

Using Cypress to mock user inputs, we tested the every use case happy path and sad path. This covers any edge cases and we can provide the proper handling, eg the form input validation for the frontend. 