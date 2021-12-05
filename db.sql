CREATE DATABASE IF NOT EXISTS `fastifydb`;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL
);

INSERT INTO users
(username, email, password)
VALUES
($1, $2, $3)
RETURNING username, email;