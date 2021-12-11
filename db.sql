CREATE DATABASE IF NOT EXISTS `fastifydb`;

-- create user table
CREATE TABLE user (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  email VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (100) NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  last_login TIMESTAMP
);

ALTER TABLE users
ALTER COLUMN profile_picture TYPE VARCHAR (65);