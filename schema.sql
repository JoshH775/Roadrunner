CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    pi INTEGER NOT NULL,
    UNIQUE (name, year, pi)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    friend_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lap_times (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    car_id INTEGER NOT NULL,
    track_id INTEGER NOT NULL,
    time INTEGER NOT NULL,
    date INTEGER NOT NULL,
    pi INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (car_id) REFERENCES cars(id)
);

CREATE TABLE IF NOT EXISTS user_friends (
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id),
    PRIMARY KEY (user_id, friend_id)
);