# Unified Ecommerce Frontend

This is a frontend for the [Unified Ecommerce](https://github.com/mitodl/unified-ecommerce) project built with React and NextJS.

## Initial Setup

First, ensure that you have the [Unified Ecommerce Bakend](https://github.com/mitodl/unified-ecommerce) up and running locally. Then:

### Configure Required Environment Variables

Environment variables are described in detail in `env/env.defaults.public`; all env vars should have functional defaults. However, a few dependencies to note:

- In the Unified Ecommerce backend, `MITOL_UE_PAYMENT_BASKET_ROOT` and `MITOL_UE_PAYMENT_BASKET_CHOOSER` should point to the this repo's frontend. (e.g., `https://uefe.odl.local:8072`)

### Run the app

#### With Docker

With `docker compose up`, you should be up and running. Visit the application at http://uefe.odl.local:8072

#### Without Docker

You can run the app outside of docker. This may be faster and more convenient. Two things are needed:

1. Some way to load environment variables. [direnv](https://direnv.net/) is a great tool for this; a sample `.envrc` file is committed in the repo.
2. A NodeJS runtime; [`nvm`](https://github.com/nvm-sh/nvm) is a simple tool for managing NodeJS versions.

With that done, `yarn start`, `yarn install`, and visit http://uefe.odl.local:8072
