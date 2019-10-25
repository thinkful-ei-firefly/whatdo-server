ALTER TABLE event
      ADD COLUMN description TEXT,
      ADD COLUMN start_time TIMESTAMP NOT NULL,
      ADD COLUMN stop_time TIMESTAMP NOT NULL,
      ADD COLUMN address TEXT NOT NULL,
      ADD COLUMN city_name TEXT NOT NULL,
      ADD COLUMN region_name TEXT NOT NULL,
      ADD COLUMN venue TEXT NOT NULL,
      ADD COLUMN image TEXT,
      ADD COLUMN url TEXT;
