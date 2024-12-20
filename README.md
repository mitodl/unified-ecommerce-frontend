# Unified Ecommerce Frontend

This is a frontend for the [Unified Ecommerce](https://github.com/mitodl/unified-ecommerce) project built with React and NextJS.

## Initial Setup

First, ensure that you have the [Unified Ecommerce Backend](https://github.com/mitodl/unified-ecommerce) up and running locally.

### Configure Required Environment Variables

Environment variables are described in detail in `env/env.defaults`; all env vars should have functional defaults. However, a few dependencies to note:

- In the Unified Ecommerce backend, `MITOL_UE_PAYMENT_BASKET_ROOT` and `MITOL_UE_PAYMENT_BASKET_CHOOSER` should point to the this repo's frontend. (e.g., `https://ue.odl.local:8072`)

_It's easiest if the React app and the backend use the same hostname._ Otherwise, you may run into some CORS and CSRF errors.

### Run the app

#### With Docker

With `docker compose up`, you should be up and running. Visit the application at http://ue.odl.local:8072

#### Without Docker

You can run the app outside of docker. This may be faster and more convenient. Two things are needed:

1. Some way to load environment variables. [direnv](https://direnv.net/) is a great tool for this; a sample `.envrc` file is committed in the repo.
2. A NodeJS runtime; [`nvm`](https://github.com/nvm-sh/nvm) is a simple tool for managing NodeJS versions.

With that done, `yarn start`, `yarn install`, and visit http://ue.odl.local:8072

### Testing the Build

You can test the build using the Docker Compose environment.

Run the app: `docker compose --profile build up`

This will run a container that will produce a build of the app, and then start an nginx container configured to serve it on port 7777. You can then go to http://ue.odl.local:7777 to test. This won't hot-reload, and you'll need to restart both `build` and `nginx` to see changes come through.

> [!IMPORTANT]
> This _also_ runs the `watch` container. You can use it too if you want - just _wait for `build` to finish doing its thing first_. (Otherwise, they step on each other.)

## Accessing the Application

The Unified Ecommerce backend uses same-site cookies for authentication. Therefore, the frontend client must run on the "same site" as the backend. Therefore, if the backend runs on `ue.odl.local:8073`, you **must** access the frontend on at a hostname such as `ue.odl.local` (or `*.odl.local`), _not_ `localhost`.

To prevent CORS and CSRF errors, set the frontend and backend URLs to be either the same hostname (`ue.odl.local`) or set the backend to be a subdomain of the frontend (`api.ue.odl.local` and `ue.odl.local` - this is closer to the actual deployment).
