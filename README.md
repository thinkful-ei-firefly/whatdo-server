# whatDO API

## Live Link

The API is deployed to Heroku [here](https://thinkful-whatdo.herokuapp.com/).

The client is deployed to zeit
[here](https://whatdo.now.sh/) and the repo
can be found [here](https://github.com/thinkful-ei-firefly/whatdo-client).

## Usage

This app allows users to:

1.  Register a new account
2.  Log in to their account
3.  Save an event to an account
4.  View all saved events
5.  Update a saved event
6.  Delete a saved event

To test out the app right away, log in using the demo credentials:

> Username: demo

> Password: pass

## Endpoints

### /User

1. `POST /api/user`

Verifies input and creates a new account if valid.

### /Auth

1. `POST /api/auth/token`

Verifies credentials and returns a JSON Web Token if valid.

### /Event

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
