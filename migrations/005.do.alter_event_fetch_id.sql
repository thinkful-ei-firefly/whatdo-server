ALTER TABLE event
      ADD CONSTRAINT fetch_unique UNIQUE (fetch_id);
