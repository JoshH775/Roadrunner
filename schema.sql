-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.cars (
  id integer NOT NULL,
  name text NOT NULL,
  year integer NOT NULL,
  pi integer NOT NULL,
  CONSTRAINT cars_pkey PRIMARY KEY (id)
);
CREATE TABLE public.lap_times (
  id integer NOT NULL DEFAULT nextval('lap_times_id_seq'::regclass),
  user_id integer NOT NULL,
  car_id integer NOT NULL,
  track_id integer NOT NULL,
  time integer NOT NULL,
  date integer NOT NULL,
  pi integer NOT NULL,
  engine_swap boolean NOT NULL DEFAULT false,
  drivetrain_swap boolean NOT NULL DEFAULT false,
  flying_lap boolean DEFAULT false,
  CONSTRAINT lap_times_pkey PRIMARY KEY (id),
  CONSTRAINT lap_times_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_friends (
  user_id integer NOT NULL,
  friend_id integer NOT NULL,
  visible boolean DEFAULT true,
  CONSTRAINT user_friends_pkey PRIMARY KEY (user_id, friend_id),
  CONSTRAINT user_friends_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_friends_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  username text NOT NULL,
  friend_code text NOT NULL UNIQUE,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  auth_user_id uuid UNIQUE,
  deleted_at integer,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT fk_auth_user FOREIGN KEY (auth_user_id) REFERENCES auth.users(id)
);