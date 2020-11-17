# Cyan Challenge - CSV to Map API

API to stores aggregated Cartesian points in a Postgres database with PostGIS extension.\
Visit [Github](https://github.com/rhacarys/csv-to-map-react) for the React App frontend.

### The API is running on [Heroku](https://csv-to-map-api.herokuapp.com/) with documentation in [Swagger](https://csv-to-map-api.herokuapp.com/)

---

## Installing and running

To clone the repository:

```bash
$ git clone https://github.com/rhacarys/csv-to-map-api.git
```

To run the API properly, you need to install the PosgreSQL server and the PostGIS extension.\
Then, create a database and execute `CREATE EXTENSION postgis;` on it.

Update the file `/api/server/src/config/config.js` with your new spatial database connection credentials.

Now, in the project directory, you can run:

### `npm install`

Installs all the dependences to run the api

### `sequelize db:migrate`

Performs migrations in the database.\
In the first run, the tables `File` and `Point` will be created in the database.

### `npm run dev`

Runs the api in the development mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

> Note that you will be automatically redirected to the swagger documentation page, on [http://localhost:8000/api/v1/api-docs](http://localhost:8000/api/v1/api-docs)

The API endpoints are now available on [http://localhost:8000/api/v1](http://localhost:8000/api/v1)

The only available enpoint is:

- `/files`

### `npm test`

Runs the API test suite

### `npm run build`

Builds the api for production to the `build` folder.\
Your api is ready to be deployed!
