

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."cars" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "year" integer NOT NULL,
    "pi" integer NOT NULL
);


ALTER TABLE "public"."cars" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lap_times" (
    "id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "car_id" integer NOT NULL,
    "track_id" integer NOT NULL,
    "time" integer NOT NULL,
    "date" integer NOT NULL,
    "pi" integer NOT NULL,
    "engine_swap" boolean DEFAULT false NOT NULL,
    "drivetrain_swap" boolean DEFAULT false NOT NULL,
    "flying_lap" boolean DEFAULT false
);


ALTER TABLE "public"."lap_times" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."lap_times_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."lap_times_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."lap_times_id_seq" OWNED BY "public"."lap_times"."id";



CREATE TABLE IF NOT EXISTS "public"."user_friends" (
    "user_id" integer NOT NULL,
    "friend_id" integer NOT NULL,
    "visible" boolean DEFAULT true
);


ALTER TABLE "public"."user_friends" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" integer NOT NULL,
    "username" "text" NOT NULL,
    "friend_code" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "auth_user_id" "uuid",
    "deleted_at" integer
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."users_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."users_id_seq" OWNED BY "public"."users"."id";



ALTER TABLE ONLY "public"."lap_times" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."lap_times_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."users_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cars"
    ADD CONSTRAINT "cars_name_year_pi_key" UNIQUE ("name", "year", "pi");



ALTER TABLE ONLY "public"."cars"
    ADD CONSTRAINT "cars_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lap_times"
    ADD CONSTRAINT "lap_times_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_friends"
    ADD CONSTRAINT "user_friends_pkey" PRIMARY KEY ("user_id", "friend_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "user_unq" UNIQUE ("username", "friend_code");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_auth_user_id_key" UNIQUE ("auth_user_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_friend_code_key" UNIQUE ("friend_code");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "fk_auth_user" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lap_times"
    ADD CONSTRAINT "lap_times_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_friends"
    ADD CONSTRAINT "user_friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_friends"
    ADD CONSTRAINT "user_friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Enable delete for users based on user_id" ON "public"."lap_times" FOR DELETE USING (("user_id" = ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_user_id" = "auth"."uid"()))));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."lap_times" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."user_friends" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."users" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."cars" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."lap_times" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."user_friends" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "Users can delete their own friendships" ON "public"."user_friends" FOR DELETE USING (("user_id" = ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_user_id" = "auth"."uid"()))));



CREATE POLICY "Users can update their own friends" ON "public"."user_friends" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_user_id" = "auth"."uid"())))) WITH CHECK (("user_id" = ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."auth_user_id" = "auth"."uid"()))));



ALTER TABLE "public"."cars" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lap_times" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_friends" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."cars" TO "anon";
GRANT ALL ON TABLE "public"."cars" TO "authenticated";
GRANT ALL ON TABLE "public"."cars" TO "service_role";



GRANT ALL ON TABLE "public"."lap_times" TO "anon";
GRANT ALL ON TABLE "public"."lap_times" TO "authenticated";
GRANT ALL ON TABLE "public"."lap_times" TO "service_role";



GRANT ALL ON SEQUENCE "public"."lap_times_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."lap_times_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."lap_times_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_friends" TO "anon";
GRANT ALL ON TABLE "public"."user_friends" TO "authenticated";
GRANT ALL ON TABLE "public"."user_friends" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
