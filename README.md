# KIGT Backend Reference

Uses Typescript and Node for backend operations needed for the Charge Cloud UI

## Features

- Connecting to MySQL database
- CRUD endpoints for the following : ADD TEXT HERE
- Webhook

## Install packages needed with npm

Install the required packages with npm.

```bash
  npm install
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/kigt-inc/charge-cloud-backend-2023.git
```

Go to the project directory

```bash
  cd charge-cloud-backend-2023
```

Install dependencies

```bash
  npm install
```

Add env file for reference check .env.example file

## Environment Variables

To run this project, you will need to add the following environment variables to an .env file

create `charge-cloud-backend-2023/.env` environement file in your local system:

- PORT
- DB_NAME
- DB_USERNAME
- DB_PASSWORD
- DB_HOST
- DB_PORT
- ZENDESK_USERNAME
- ZENDESK_API_TOKEN
- ZENDESK_REMOTE_URL
- JWT_SECRET_KEY
- ACCESS_TOKEN_EXPIRY

These are used to establish a connection between the project and the specified MySQL database.

Create the database at mysql

To run migrations

```bash
npx sequelize-cli db:migrate
```

To run seeders

```bash
npx sequelize-cli db:seed:all
```

Start the server

```bash
npm run dev
```

## Run Server on the Production with all migrations

```bash
npm run start
```

## API Reference
