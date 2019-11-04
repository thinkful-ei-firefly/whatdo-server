const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Event Endpoints', function() {
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

    const requiredFields = [
      'name',
      'fetch_id',
      'description',
      'start_time',
      'stop_time',
      'address',
      'city_name',
      'region_name',
      'venue'
    ];

    requiredFields.forEach(field => {
      const newEvent = {
        name: 'Test new event',
        fetch_id: '12345',
        description: 'Test new description',
        start_time: '1999-01-08 04:05:06',
        stop_time: '1999-01-08 06:05:06',
        address: '123 New Test St',
        city_name: 'Testville',
        region_name: 'Testing County',
        venue: 'Test Music Hall'
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
        name: 'Test new event',
        fetch_id: '12345',
        description: 'Test new description',
        start_time: '1999-01-08T04:05:06.000Z',
        stop_time: '1999-01-08T06:05:06.000Z',
        address: '123 New Test St',
        city_name: 'Testville',
        region_name: 'Testing County',
        venue: 'Test Music Hall'
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
          user_id: testUser.id,
          description: correctPostBody.description,
          start_time: correctPostBody.start_time,
          stop_time: correctPostBody.stop_time,
          address: correctPostBody.address,
          city_name: correctPostBody.city_name,
          region_name: correctPostBody.region_name,
          venue: correctPostBody.venue,
          image: null,
          url: null
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
        fetch_id: '1337'
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
          user_id: testUser.id,
          description: testEvent.description,
          start_time: testEvent.start_time,
          stop_time: testEvent.stop_time,
          address: testEvent.address,
          city_name: testEvent.city_name,
          region_name: testEvent.region_name,
          venue: testEvent.venue,
          image: testEvent.image,
          url: testEvent.url
        });
    });
  });
});
