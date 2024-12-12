# Unified Ecommerce Frontend

This is a frontend for the [Unified Ecommerce](https://github.com/mitodl/unified-ecommerce) project built with React and NextJS.

## Initial Setup

First, ensure that you have the [Unified Ecommerce Bakend](https://github.com/mitodl/unified-ecommerce) up and running locally.

### Configure Required Environment Variables

Environment variables are described in detail in `env/env.defaults.public`; all env vars should have functional defaults. However, a few dependencies to note:

- In the Unified Ecommerce backend, `MITOL_UE_PAYMENT_BASKET_ROOT` and `MITOL_UE_PAYMENT_BASKET_CHOOSER` should point to the this repo's frontend. (e.g., `https://ue.odl.local:8072`)

### Run the app

#### With Docker

With `docker compose up`, you should be up and running. Visit the application at http://ue.odl.local:8072

#### Without Docker

You can run the app outside of docker. This may be faster and more convenient. Two things are needed:

1. Some way to load environment variables. [direnv](https://direnv.net/) is a great tool for this; a sample `.envrc` file is committed in the repo.
2. A NodeJS runtime; [`nvm`](https://github.com/nvm-sh/nvm) is a simple tool for managing NodeJS versions.

With that done, `yarn start`, `yarn install`, and visit http://ue.odl.local:8072

## Accessing the Application

The Unified Ecommerce backend uses same-site cookies for authentication. Therefore, the frontend client must run on the "same site" as the backend. Therefore, if the backend runs on `ue.odl.local:8073`, you **must** access the frontend on at a hostname such as `ue.odl.local` (or `*.odl.local`), _not_ `localhost`.

To prevent CORS and CSRF errors, set the frontend and backend URLs to be either the same hostname (`ue.odl.local`) or set the backend to be a subdomain of the frontend (`api.ue.odl.local` and `ue.odl.local` - this is closer to the actual deployment).
