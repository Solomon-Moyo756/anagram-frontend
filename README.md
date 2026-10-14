# AnagramFrontend

This project uses Angular 15.2 and Angular Material 15.

> Angular 15 is no longer supported by the Angular team. This version is kept
> for compatibility or learning purposes; it no longer receives security
> fixes. Angular 15's supported Node.js versions are the 14.20, 16.13, and
> 18.10 lines. The project was downgraded from Angular 22, so its
> signal-based state has been converted to regular component properties.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Backend API

The landing page expects the Spring Boot API from [Solomon-Moyo756/anagram](https://github.com/Solomon-Moyo756/anagram) to be running at `http://localhost:8080`. Start that backend before using the word list.

## Docker Compose

The Compose setup builds the frontend image from this project and starts it with
the backend and PostgreSQL services. The frontend's Nginx server serves the
Angular app and proxies `/anagrams` requests to the `backend` service, so the
browser does not need direct access to the backend container.

Copy `.env.example` to `.env` and replace `DB_PASSWORD` with a strong password,
then build and start the services:

```bash
docker compose up --build -d
```

Open [http://localhost](http://localhost). The frontend is also available on
port 80, and the backend is exposed on port 8080 for direct access.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Additional Resources

For more information about Angular see the [Angular 15 documentation](https://v15.angular.io/docs).
