# whatDO API

## Engineering Team

- Jessica Doyle (Project Manager)
- Ben Rosen (Backend Lead)
- Cody Oberholtzer (Frontend Lead)
- Ahmed AM (Design Lead)

## Links

- [whatDO Live API](https://thinkful-whatdo.herokuapp.com/)
- [whatDO Live Client](https://whatdo.now.sh/)
- [Client Repo](https://github.com/thinkful-ei-firefly/whatdo-client)

## App Description

Making plans for the weekend doesn't always have to be hard. No matter where you
are, our WhatDo app will let you learn about all kinds of fun events near your
location, from concerts and plays to sporting events and museums. Our app also
gives you a brief weather report for your selected day, so you can decide for
yourself if you'd rather spend the day inside or outside. Favorite events can be
saved to your profile, so you can look up the details quickly at a later time.

## Usage

This app allows users to:

1.  Register a new account
2.  Log in to their account
3.  Save an event to an account
4.  View all saved events
5.  Update a saved event
6.  Delete a saved event

To test out the app right away, use the following credentials:

> Username: demo

> Password: pass

## Endpoints

### /user

1. `POST /api/user`

Verifies input and registers a new account if valid.

### /auth

1. `POST /api/auth/token`

Verifies credentials and returns a JSON Web Token if valid.

### /event

1. `GET /api/event`

Returns an array of event objects.

2. `GET /api/event/:event_id`

Returns a single event object whose id matches `:event_id`.

3. `POST /api/event`

Verifies input and adds event to the database if valid.

4. `PATCH /api/event/:event_id`

Verifies input and updates the columns in the database for the row matching `:event_id`.

5. `DELETE /api/event/:event_id`

Deletes the row from the database where id matches `:event_id`.

## Built with

- NPM
- Node
- Express
- PostgreSQL

## Development

- Installation: Fork or clone the repo to your machine and run `npm install`
- Create a PostgreSQL database (and test database) and make a .env file, filling in appropriate
  values for the following variables:

```sh
NODE_ENV=development
PORT=8000
TZ='UTC'
CLIENT_ORIGIN=
MIGRATION_DB_HOST=127.0.0.1
MIGRATION_DB_PORT=5432
MIGRATION_DB_NAME=
MIGRATION_DB_USER=
MIGRATION_DB_PASS=
DATABASE_URL=
TEST_DATABASE_URL=
JWT_SECRET=
```

- Database Migration: `npm run migrate`
- Database Seed file: 'seeds/seed.tables.sql'
- Running: `npm start` (node) or `npm run dev` (nodemon)
- Testing: `npm test`

Want to contribute? Great!

To fix a bug or enhance an existing module, follow these steps:

1. Fork the repo
2. Create a new branch (`git checkout -b improve-feature`)
3. Make the appropriate changes in the files
4. Add changes to reflect the changes made
5. Commit your changes (`git commit -am 'Improve feature'`)
6. Push to the branch (`git push origin improve-feature`)
7. Create a Pull Request
