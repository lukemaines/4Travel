# 4Travel

4Travel is a travel planning application that allows users to register, log in, plan trips, and view planned trips. Users can also edit or delete their trips, view top attractions at their destination, and get information about the cost of living.

## Features

* User Registration
* User Login and Logout
* Plan a Trip
* View Planned Trips
* Edit or Delete Trips
* View Top Attractions at the Destination
* Get Cost of Living Information

## Technologies Used

* Node.js
* Express.js
* Handlebars.js
* Sequelize ORM
* PostgreSQL
* HTML, CSS, JavaScript

## Getting Started

#### Prerequisites
* Node.js installed on your machine
* PostgreSQL database set up

#### Installation
1. Clone the repository
```sh
git clone https://github.com/lukemaines/4Travel.git
cd 4Travel
```
2. Install the dependencies
```sh
npm install
```
3. Setup environment variables
   Create a `.env` file in the root directory of the project and add your environment variables:
   ```
   DB_NAME='4travel_db'
   DB_USER=<your-database-username>
   DB_PASSWORD=<your-database-password>
   GEOAPIFY_API_KEY=<your-geoapify-api-key>
   TRUEWAY_API_KEY=<your-trueway-api-key>
   RAPIDAPI_KEY=<your-rapidapi-key>
   RAPIDAPI_HOST=<your-rapidapi-host>
   ```
4. Set up database
   Create a database named `4travel_db` in your local pgAdmin - postgresql
5. Seed the database and create datatable
   ```sh
   npm run seed
   ``` 
#### Running the Application
1. Start the node server
```sh
npm run start
```
2. Open your browser and go to http://localhost:3001.

## Project structure
```graphql
4Travel/
├── config/
│   └── connection.js      # Database connection setup
├── controllers/
│   ├── api/
│   │   └── index.js
│   │   └── userRoutes.js  # API routes for users 
│   │   └── tripRoutes.js  # API routes for trips
│   └── homeRoutes.js      # Routes for rendering pages
├── helpers/
│   ├── handlebarsHelpers.js    #Helper functions used in handlebars
├── models/
│   ├── index.js
│   ├── Trip.js            # Trip model
│   └── User.js            # User model
├── public/
│   ├── css/
│   │   └── styles.css     # CSS styles
│   ├── js/
│   │   └── login.js        # JavaScript for login
│   │   └── logout.js        # JavaScript for logout
│   │   └── main.js        # JavaScript for frontend
├── seeds/
│   └── seed.js            # Database seeding script
│   └── tripData.json      # Sample seed data for trips
│   └── userData.json      # Sample seed data for users
├── utils/
│   ├── auth.js            # Middleware for authentication
│   └── formatDate.js      # Utility function for formatting dates
│   └── helpers.js         # Additional helper methods
├── views/
│   ├── layouts/
│   │   └── main.handlebars  # Main layout
│   ├── partials/
│   │   └── navigation.handlebars  # Navigation partial
│   ├── homepage.handlebars  # Homepage
│   ├── login.handlebars     # Login page
│   ├── register.handlebars  # Registration page
│   ├── trips.handlebars     # Trips dashboard
│   └── plan_trip.handlebars # Plan a trip page
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # NPM package file
├── package-lock.json       # NPM package lock file
└── server.js               # Server entry point
```

## API Endpoints

```
GET /api/trips - Fetch all trips for the logged-in user
POST /api/trips - Create a new trip
PUT /api/trips/:id - Edit a trip
DELETE /api/trips/:id - Delete a trip
GET /api/trips/attractions - Get top attractions for a destination
POST /api/trips/cost-of-living - Get cost of living information for a destination
```

## Demo

* [Register a new user](https://drive.google.com/file/d/1bkhlQM_kgNH_RiNF8Xf5WAQu7G3T2jdP/view?usp=sharing)
* [Login as an existing user](https://drive.google.com/file/d/1F3MWf8Pdd8g6cSy8l63ZfS3_m-tEDrrj/view?usp=sharing)
* [Trips - planning and dashboard](https://drive.google.com/file/d/1jB83H3yEWIHoV-vYsZ5BaK0sa8iLgTyA/view?usp=sharing)
* [Logout of existing session](https://drive.google.com/file/d/1eX0YPVE2oOYJK3lr2zBxlFQfCkCuOpdV/view?usp=sharing)

## Contributors

* [Luke Maines](https://github.com/lukemaines/)
* [Pritam Sur](https://github.com/surpritam)
* [Sean Singer](https://github.com/S1NGS1NG80)
* [Alexis Langille](https://github.com/alangille01)

## License

This project is licensed under the MIT License.

## Acknowledgements

[Geoapify](https://www.geoapify.com)
[Trueway](https://rapidapi.com/trueway/api/trueway-places)
[RapidAPI](https://rapidapi.com/traveltables/api/cost-of-living-and-prices)
[Unsplash for the hero image](https://unsplash.com)


