# Hancock DLT Adapter

Microservice belonging to Hancock's ecosystem, which adapts transactions described in a common schema
to the different blockchain implementatations' internal schemas.

## Overview

Hancock is a research product conceived within BBVA New digital business - R&D that provides convenient services to integrate with different DLT networks. We provide simplicity, adaptability and efficiently to develop in any DLT. Hancock can be divided into three main components:

- [DLT Adapter](https://github.com/BBVA/hancock-dlt-adapter) - Keep it simple
Interface to abstract interaction with different DLT networks.

- [Wallet Hub](https://github.com/BBVA/hancock-wallet-hub) - Enroute Interactions
Enable connect their signer wallets, or wallet service providers, to the wallet hub, that will then route any ready-to-sign transaction.

- [DLT Broker](https://github.com/BBVA/hancock-dlt-broker) - Real time notifications
Provides a websocket connection that propagates any DLT event the user is subscribed. Thus, provides an interface to easily and efficiently subscribe to blockchain asynchronous events to avoid constant request of status.

- SDKs - Provides a simplified consumption, minimizing the risk for errors and improving product quality
	- [Node.js](https://github.com/BBVA/hancock-sdk-nodejs)
    - [Java / Android](https://github.com/BBVA/hancock-sdk-java-android)

## Motivation

Smart Contracts are small programs that serve as interfaces for state changes on a distributed ledger. Currently there is no standard specification for these interfaces and invocations are done in a very specific and unusable way, e.g. in Ethereum by translating transactions into a binary interface.

Furthermore, in order to exploit full decentralization provided by blockchain, users should retain control over their wallets and trusted peers and avoid scenarios where communication with blockchain is centralized on a gateway service that controls user private keys and trusted peers.

## Proposed Change

DLT Adapter is a web service that abstracts user interactions with DLT networks on a high-level common HTTP REST interface that conveniently provides the user with the specific DLT type adapted transaction that can be easily inspected, signed and personally sent to a DLT network trusted node of the choice of the user.

There are 4 identified high-level interactions with a blockchain:

1. Smart Contract creation
2. Smart Contract transactions
3. Token transfers
4. Notarizations

It is necessary to keep in mind to include the chain identifier in adapted transaction, which must be executed just in the appropriate network. 

### Current blockchains supported

* Ethereum

### Building the service

Clone the project:
```bash
  # Clone the project 
  git clone https://github.com/BBVA/hancock-dlt-adapter.git
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

Once we have built the service, we need to configure a few things before launching it. You can find all environment vars 
available to configure the service in `config/custom-environment-variables.yaml`.

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

Documentation about the API can be found in this [link](https://BBVA.github.io/hancock-dlt-adapter/api.html)

### Contribution guidelines

If you are thinking about contributing to the project, you should know that:

- The code has been written following the [clean architecture principles](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html), as well as [SOLID design principles](https://es.wikipedia.org/wiki/SOLID).

- The project is built in [typescript](https://www.typescriptlang.org/) v2.9.2 using the [recommended guidelines](https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts). Also there is a linter rules configured to follow this guidelines, so you can search for a plugin for your favourite IDE to be warned about this linter errors.
