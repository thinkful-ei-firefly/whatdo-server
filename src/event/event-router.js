const express = require('express');
const EventService = require('./event-service');
const { requireAuth } = require('../middleware/jwt-auth');
const xss = require('xss');
const eventRouter = express.Router();
const jsonParser = express.json();

const serializeEvent = event => ({
  id: event.id,
  name: xss(event.name),
  fetch_id: event.fetch_id
});

eventRouter.use(requireAuth);

eventRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const events = await EventService.getEvents(
        req.app.get('db'),
        req.user.id
      );
      res.json({ events });
      next();
    } catch (error) {
      next(error);
    }
  })
  .post(jsonParser, async (req, res, next) => {
    try {
      const { name, fetch_id } = req.body;
      const user_id = req.user.id;
      const newEvent = { name, fetch_id, user_id };

      for (const [key, value] of Object.entries(newEvent))
        if (!value)
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          });

      const post = await EventService.postEvent(req.app.get('db'), newEvent);
      res.status(201).json(post);
      next();
    } catch (error) {
      next(error);
    }
  });

eventRouter
  .route('/:event_id')
  .all(async (req, res, next) => {
    try {
      const event = await EventService.getEventById(
        req.app.get('db'),
        req.params.event_id
      );

      if (!event) {
        return res.status(404).json({
          error: { message: 'Event not found' }
        });
      }
      res.event = event;
      next();
    } catch (error) {
      next(error);
    }
  })
  .get((req, res, next) => {
    res.json(serializeEvent(res.event));
  })
  .delete(async (req, res, next) => {
    try {
      await EventService.deleteEvent(req.app.get('db'), req.params.event_id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  })
  .patch(jsonParser, async (req, res, next) => {
    try {
      const { name, fetch_id } = req.body;
      const user_id = req.user.id;
      const patchedEvent = { name, fetch_id, user_id };

      for (const [key, value] of Object.entries(patchedEvent))
        if (!value)
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          });

      const patch = await EventService.patchEvent(
        req.app.get('db'),
        req.params.event_id,
        patchedEvent
      );
      res
        .status(200)
        .json(patch)
        .end();
    } catch (error) {
      next(error);
    }
  });

module.exports = eventRouter;
