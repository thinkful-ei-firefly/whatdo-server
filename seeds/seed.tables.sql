BEGIN;

TRUNCATE
  event,
  "user";

INSERT INTO "user" (id, username, nickname, email, password)
VALUES
  (
    1,
    'demo',
    'Demo',
    'demo@testing.com',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO event
       (
        id,
        name,
        fetch_id,
        user_id,
        description,
        start_time,
        stop_time,
        address,
        city_name,
        region_name,
        venue,
        image,
        url
       )
VALUES
  (
    1,
    'The Best Event',
    1234,
    1,
    'Short Description',
    '1999-01-08 04:05:06',
    '1999-01-08 06:05:06',
    '123 Main St',
    'Gotham',
    'Northeast',
    'Music hall',
    'shorturl.at/ajIMQ',
    'https://www.visitphilly.com/articles/philadelphia/fall-harvest-festivals/'
  ),
  (
    2,
    'A Better Event',
    1235,
    1,
    'Short Description',
    '1999-01-08 04:05:06',
    '1999-01-08 06:05:06',
    '123 Main St',
    'Gotham',
    'Northeast',
    'Music hall',
    'shorturl.at/ajIMQ',
    'https://www.visitphilly.com/articles/philadelphia/fall-harvest-festivals/'
  ),
  (
    3,
    'A Good Enough Event',
    1236,
    1,
    'Short Description',
    '1999-01-08 04:05:06',
    '1999-01-08 06:05:06',
    '123 Main St',
    'Gotham',
    'Northeast',
    'Music hall',
    'shorturl.at/ajIMQ',
    'https://www.visitphilly.com/articles/philadelphia/fall-harvest-festivals/'
  );
  
SELECT setval('event_id_seq', (SELECT MAX(id) from event));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
