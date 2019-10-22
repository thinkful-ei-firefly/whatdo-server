const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL
  });
}

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      nickname: 'Test user 1',
      email: 'user1@testing.com',
      password: 'password'
    },
    {
      id: 2,
      username: 'test-user-2',
      nickname: 'Test user 2',
      email: 'user2@testing.com',
      password: 'password'
    }
  ];
}

function makeEvents(user) {
  const events = [
    {
      id: 1,
      name: 'event 1',
      fetch_id: 1,
      user_id: user.id
    },
    {
      id: 2,
      name: 'event 2',
      fetch_id: 1,
      user_id: user.id
    },
    {
      id: 3,
      name: 'event 3',
      fetch_id: 1,
      user_id: user.id
    },
    {
      id: 4,
      name: 'event 4',
      fetch_id: 1,
      user_id: user.id
    },
    {
      id: 5,
      name: 'event 5',
      fetch_id: 1,
      user_id: user.id
    }
  ];

  return events;
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx
      .raw(
        `TRUNCATE
        "event",
        "user"`
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE event_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE user_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('event_id_seq', 0)`),
          trx.raw(`SELECT setval('user_id_seq', 0)`)
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.transaction(async trx => {
    await trx.into('user').insert(preppedUsers);

    await trx.raw(`SELECT setval('user_id_seq', ?)`, [
      users[users.length - 1].id
    ]);
  });
}

async function seedUsersEvents(db, users, events) {
  await seedUsers(db, users);

  await db.transaction(async trx => {
    await trx.into('event').insert(events);

    await trx.raw(`SELECT setval('event_id_seq', ?)`, [
      events[events.length - 1].id
    ]);
  });
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeEvents,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  seedUsersEvents
};
