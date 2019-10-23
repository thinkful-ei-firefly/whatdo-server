const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Event Endpoints', function() {
  let db;

  const testUsers = helpers.makeUsersArray();
  const [testUser] = testUsers;
  const testEvents = helpers.makeEvents(testUser);

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

  describe.skip('GET /api/event/:event_id', () => {
    beforeEach('insert users and events', () => {
      return helpers.seedUsersEvents(db, testUsers, testEvents);
    });

    it(`responds with 200 and correct event`, () => {
      const testEvent = testEvents[0];
      const event_id = testEvents.indexOf(testEvent) + 1;
      return supertest(app)
        .get(`/api/event/${event_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.keys('event');

          const event = res.body.event;
          expect(event).to.have.property('id', testEvent.id);
          expect(event).to.have.property('name', testEvent.name);
          expect(event).to.have.property('fetch_id', testEvent.fetch_id);
          expect(event).to.have.property('user_id', testEvent.user_id);
        });
    });
  });

  describe.skip('DELETE /api/event/:event_id', () => {});
  beforeEach('insert users and events', () => {
    return helpers.seedUsersEvents(db, testUsers, testEvents);
  });

  describe.skip('PATCH /api/event/:event_id', () => {});
  beforeEach('insert users and events', () => {
    return helpers.seedUsersEvents(db, testUsers, testEvents);
  });
});
