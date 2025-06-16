# Roadrunner – Forza Horizon 5 Lap Time Tracker

**Roadrunner** is a web app designed to help *Forza Horizon 5* players log and organise their lap times across different tracks, cars, and builds. While the in-game leaderboards only display your single best time per track and restrict visibility to players on the same platform, Roadrunner makes it possible to track every run and compare results with friends across systems.

The app was built to fill that gap. Whether you're testing a new car class, tuning setup, or just want to preserve more context around your laps, Roadrunner gives you a flexible way to record and reflect on your driving performance.

_Note: Automatic lap time logging via telemetry was considered early in development. While technically feasible through FH5’s telemetry server and external tooling, it would require a more advanced setup than this project currently supports. Roadrunner instead focuses on a reliable, manual entry experience that's accessible to most players._

## Features

- **Lap Time Entry:** Add a lap right after completing a race. Log details like car, PI, track, drivetrain, and other contextual details.
- **Personal Lap Table:** View all your entries in a sortable table. See how your times evolve over time or across vehicles.
- **Player Profiles:** Each user has their own collection of laps visible to others (depending on visibility settings).
- **Stats & Insights:** See your fastest laps, average times, and favorite cars. More visualizations planned in future updates.
- **Track & Car Filtering:** Filter your entries (and others’) by car, track, class, and modifications.
- **Friend Codes:** Share your profile via a unique code. Others can follow your lap times once they add it. If you want to see theirs, they’ll need to share their code too.
- **Authentication:** Login and registration handled through Supabase Auth.
- **Cloud Sync:** Lap data is stored securely and stays synced across devices via Supabase.
