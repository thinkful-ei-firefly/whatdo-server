const express = require('express');
const EventService = require('./event-service');
const { requireAuth } = require('../middleware/jwt-auth');
const xss = require('xss');
const eventRouter = express.Router();
const jsonParser = express.json();

const serializeEvent = event => ({
  id: event.id,
  name: xss(event.name),
  fetch_id: event.fetch_id,
  user_id: event.user_id
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
      const {
        name,
        fetch_id,
        description,
        start_time,
        stop_time,
        address,
        city_name,
        region_name,
        venue,
        image,
        url
      } = req.body;
      const user_id = req.user.id;
      const requiredFields = {
        name,
        fetch_id,
        description,
        start_time,
        stop_time,
        address,
        city_name,
        region_name,
        venue
      };

      for (const [key, value] of Object.entries(requiredFields))
        if (!value)
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          });

      const newEvent = { ...requiredFields, user_id };

      if (image) {
        newEvent.image = image;
      }

      if (url) {
        newEvent.url = url;
      }

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
      const {
        name,
        fetch_id,
        description,
        start_time,
        stop_time,
        address,
        city_name,
        region_name,
        venue,
        image,
        url
      } = req.body;
      const user_id = req.user.id;
      const patchFields = {
        name,
        fetch_id,
        description,
        start_time,
        stop_time,
        address,
        city_name,
        region_name,
        venue,
        image,
        url
      };
      const patchedEvent = {};

      let check = false;
      for (const [key, value] of Object.entries(patchFields)) {
        if (value) {
          check = true;
          patchedEvent[key] = value;
        }
      }

      if (!check) {
        return res.status(400).json({
          error: { message: `Input must not be null` }
        });
      }

      patchedEvent.user_id = user_id;

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
