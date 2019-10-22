const EventService = {
  getEvents(db, user_id) {
    return db
      .from('event')
      .select('*')
      .where({ user_id });
  },

  postEvent(db, newEvent) {
    return db
      .into('event')
      .insert(newEvent)
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getEventById(db, id) {
    return db
      .from('event')
      .select('*')
      .where({ id })
      .first();
  },

  deleteEvent(db, id) {
    return db('event')
      .where({ id })
      .delete();
  },

  patchEvent(db, id, newEventFields) {
    return db('event')
      .where({ id })
      .update(newEventFields);
  }
};

module.exports = EventService;
