# order-service

To start the app,<br />

#### STEP 1<br />

We run IDP Service and NG Manager on your local machine<br />
and proceed to STEP 2<br /><br />
To run this without setting up harness-core<br />
We provide the required configuration for it to run by pointing it to [PRE-QA](https://stress.harness.io/). <br />
For that
Lets add these in your .zshrc file

```sh
export IDP_SERVICE_SECRET=token #here token is Service to Service AUTH token based on the environment you're pointing at
export IDP_SERVICE_BASE_URL=https://stress.harness.io/
```

#### STEP 2<br />

then run:

```sh
yarn setup
yarn install
yarn dev
```

Now in [Harness Core UI](https://github.com/harness/harness-core-ui) (`develop` branch), run:

```sh
yarn setup-github-registry
```

It will generate `.npmrc` file for you in your project. Copy the token from `.npmrc` ( it will be in line `//npm.pkg.github.com/:_authToken=<TOKEN>`) and put it in your `.zshrc` or `.bashrc`. Alternatively you can replace `${NPM_TOKEN}` with the copied token in `.yarnrc.yml`. Do not commit `.yarnrc.yml` file.

```sh
touch .env
echo FF_IDP_ENABLED=true >> .env
echo ENABLE_IDP=true >> .env
echo TARGET_LOCALHOST=false >> .env

yarn
yarn dev
```

Access IDP in Harness at https://localhost:8181/#/account/zEaak-FLS425IEO7OLzMUg/idp/catalog
