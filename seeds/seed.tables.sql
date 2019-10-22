BEGIN;

TRUNCATE
  "event",
  "user";

INSERT INTO "user" ("id", "username", "nickname", "email", "password")
VALUES
  (
    1,
    'demo',
    'Demo',
    'demo@testing.com',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "event" ("id", "name", "fetch_id", "user_id")
VALUES
  (
    1,
    'The Best Event',
    1234,
    1
  ),
  (
    2,
    'A Better Event',
    1235,
    1
  ),
  (
    3,
    'A Good Enough Event',
    1236,
    1
  );
  
SELECT setval('event_id_seq', (SELECT MAX(id) from "event"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
