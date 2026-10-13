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
