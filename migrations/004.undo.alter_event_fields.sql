ALTER TABLE event
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS start_time,
      DROP COLUMN IF EXISTS stop_time,
      DROP COLUMN IF EXISTS address,
      DROP COLUMN IF EXISTS city_name,
      DROP COLUMN IF EXISTS region_name,
      DROP COLUMN IF EXISTS venue,
      DROP COLUMN IF EXISTS image,
      DROP COLUMN IF EXISTS url;
