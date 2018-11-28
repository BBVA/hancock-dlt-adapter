# Hancock Dlt Adapter

Microservice belonging to Hancock's ecosystem which adapt transactions described in a common schema
to then different blockchain implementatations internal schemas.

### Current blockchains supported

* Ethereum

### Building the service

Clone the project:
```bash
  # Clone the project 
  git clone ssh://git@bitbucket.kickstartteam.es:7999/bh/kst-hancock-ms-dlt-adapter.git
  cd kst-hancock-ms-dlt-adapter
```

With node and npm or yarn:
```bash
  # With npm
  npm install
  npm run build:ts
  npm run serve:prod

  # With yarn
  yarn install
  yarn run build:ts
  yarn run serve:prod
```

With [docker](https://www.docker.com/):
```bash
  # Build the docker image
  docker build -t hancock_dlt_adapter .

  # Run the docker container
  docker run -d -it --name -p 80:80 hancock_dlt_adapter_container hancock_dlt_adapter
```

### Setting up the service

Once we have built the service, we need to configure a few things before launch it. You can find all environment vars 
availables to configure the service in `config/custom-environment-variables.yaml`.

An example of configuration of the most important vars:

- Ethereum rpc node:
```bash
  export HANCOCK_BLOCKCHAIN_ETHEREUM_PROTOCOL="http"
  export HANCOCK_BLOCKCHAIN_ETHEREUM_HOST="52.80.128.77"
  export HANCOCK_BLOCKCHAIN_ETHEREUM_PORT="34774"
```

- Mongo ddbb host:
```bash
  export HANCOCK_DB_HOSTS="localhost:27017"
  export HANCOCK_DB_DATABASE="hancock"
  export HANCOCK_DB_ETHEREUM_DATABASE="hancock_eth"
```

### API Docs

Documentation about the API can be found in this [link](https://docs.kickstartteam.es/hancock/kst-hancock-ms-dlt-adapter/docs/api.html)

### Contribution guidelines

If you are thinking in contribute to the project you should know that:

- The code has been written following the [clean architecture principles](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html), as well as [SOLID design principles](https://es.wikipedia.org/wiki/SOLID).

- The project is built in [typescript](https://www.typescriptlang.org/) v2.9.2 using the [recommended guidelines](https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts). Also there is a linter rules configured to follow this guidelines, so you can search for a plugin for your favourite IDE to be warned about this linter errors.
