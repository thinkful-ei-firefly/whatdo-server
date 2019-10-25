const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Event Endpoints', function() {
  let db;

  const testUsers = helpers.makeUsersArray();
  const [testUser] = testUsers;
  const testEvents = helpers.makeEvents(testUser);
  const [testEvent] = testEvents;

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/event', () => {
    beforeEach('insert users and events', () => {
      return helpers.seedUsersEvents(db, testUsers, testEvents);
    });

    it(`responds with 200 and user's events`, () => {
      return supertest(app)
        .get('/api/event')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.keys('events');

          testEvents.forEach((userEvent, idx) => {
            const event = res.body.events[idx];
            expect(event).to.have.property('id', userEvent.id);
            expect(event).to.have.property('name', userEvent.name);
            expect(event).to.have.property('fetch_id', userEvent.fetch_id);
            expect(event).to.have.property('user_id', userEvent.user_id);
          });
        });
    });
  });

  describe('POST /api/event', () => {
    beforeEach('insert users and events', () => {
      return helpers.seedUsersEvents(db, testUsers, testEvents);
    });

    const requiredFields = ['name', 'fetch_id'];

    requiredFields.forEach(field => {
      const newEvent = {
        name: 'Test new event',
        fetch_id: 12345
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newEvent[field];

        return supertest(app)
          .post('/api/event')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(newEvent)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          });
      });
    });

    it('responds with 201 and created post when fields are correct', () => {
      const correctPostBody = {
        name: 'New Event',
        fetch_id: 12345
      };
      return supertest(app)
        .post('/api/event')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(correctPostBody)
        .expect(201)
        .expect({
          id: testEvents.length + 1,
          name: correctPostBody.name,
          fetch_id: correctPostBody.fetch_id,
          user_id: testUser.id
        });
    });
  });

  describe('GET /api/event/:event_id', () => {
    beforeEach('insert users and events', () => {
      return helpers.seedUsersEvents(db, testUsers, testEvents);
    });

    it(`responds with 200 and correct event`, () => {
      const eventId = testEvent.id;
      return supertest(app)
        .get(`/api/event/${eventId}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect(res => {
          const event = res.body;
          expect(event).to.have.property('id', testEvent.id);
          expect(event).to.have.property('name', testEvent.name);
          expect(event).to.have.property('fetch_id', testEvent.fetch_id);
          expect(event).to.have.property('user_id', testEvent.user_id);
        });
    });
  });

  describe('DELETE /api/event/:event_id', () => {
    beforeEach('insert users and events', () => {
      return helpers.seedUsersEvents(db, testUsers, testEvents);
    });

    it(`responds with 200 and removes the event from the database`, () => {
      const eventId = testEvent.id;
      return supertest(app)
        .del(`/api/event/${eventId}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200);
    });
  });

  describe('PATCH /api/event/:event_id', () => {
    beforeEach('insert users and events', () => {
      return helpers.seedUsersEvents(db, testUsers, testEvents);
    });

    it(`responds with 400 and an error message with no new input`, () => {
      const eventId = testEvent.id;
      const badPatch = {
        notName: 'nice try',
        notFetch: 123
      };

      return supertest(app)
        .patch(`/api/event/${eventId}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(badPatch)
        .expect(400, {
          error: { message: `Input must not be null` }
        });
    });

    it('responds with 201 and created post when fields are correct', () => {
      const eventId = testEvent.id;
      const goodPatch = {
        name: 'Changed Event',
        fetch_id: 1337
      };
      return supertest(app)
        .patch(`/api/event/${eventId}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(goodPatch)
        .expect(200)
        .expect({
          id: testEvent.id,
          name: goodPatch.name,
          fetch_id: goodPatch.fetch_id,
          user_id: testUser.id
        });
    });
  });
});