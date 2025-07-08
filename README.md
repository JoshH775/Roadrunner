# Roadrunner - Forza Horizon 5 Lap Time Tracker

**Roadrunner** is a web app designed to help *Forza Horizon 5* players log and organise their lap times across different tracks, cars, and builds. While the in-game leaderboards only display a single best time per track and restrict visibility to players on the same platform, Roadrunner enables you to track every run and compare results with friends across systems.

The app was built to fill that gap. Whether you're testing a new car class, experimenting with a tuning setup, or simply wanting to preserve more context around your laps, Roadrunner provides a flexible way to record and reflect on your driving performance.

_Note: Automatic lap time logging via telemetry was considered early in development. Although technically feasible through FH5’s telemetry server and external tooling, it would require a more advanced setup than this project currently supports. Roadrunner instead focuses on a reliable, manual entry experience that's accessible to most players._

## Live Site

Try it out live at [https://horizonroadrunner.pages.dev](https://horizonroadrunner.pages.dev).

## Features

- **Lap Time Entry:** Add a lap immediately after completing a race, logging details such as car, performance index (PI), track, drivetrain, and other contextual information.
- **Personal Lap Table:** View your recorded laps in a sortable table, enabling you to track performance over time and across different vehicles.
- **Player Profiles:** Each user has their own collection of laps that can be shared with others based on visibility settings.
- **Stats & Insights:** Track your fastest laps, average times, and preferred vehicles. Future updates will bring enhanced visualisations and analytics.
- **Filtering Options:** Filter your lap records (and view those of others) by car, track, class, and modifications.
- **Friend Codes:** Share your profile via a unique code. Others can follow your lap times by adding your code, with reciprocity remaining optional.
- **Authentication & Cloud Sync:** User login and registration are powered by Supabase, ensuring that your lap data remains securely stored and synced across devices.

## Technology & Architecture

Roadrunner leverages a modern web tech stack:
- **Frontend:** Built with React and TypeScript, using Vite for efficient development and build processes. Styling is done with Tailwind CSS.
- **Utilities:** Zustand manages local state, Lucide Icons provide scalable iconography, and Day.js handles date and time manipulation.
- **Backend:** Supabase handles authentication and cloud data storage, supporting the manual entry system and user profiles.

## Roadmap

- Enhance statistical analysis and develop advanced data visualisations.
- Explore potential integration with telemetry for automatic lap time logging.
- Expand filtering and customisation options.
- Expand to other race types besides road racing, and potentially adding support for new game releases.

## Contact

For feedback, questions, or further information, please open an issue on GitHub.
