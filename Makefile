.PHONY: build-dev dev test prod shell db-shell-prod docs db-dev db-shell-dev db-init-dev down-dev

YML_DEV=environment/dev/docker-compose.yml
COMPOSE_DEV=docker-compose -f ${YML_DEV}

build-dev:
	${COMPOSE_DEV} build

dev: build-dev
	${COMPOSE_DEV} run --rm --service-ports hancock_dlt_adapter dev && ${COMPOSE_DEV} down

test: build-dev
	${COMPOSE_DEV} run --rm --service-ports hancock_dlt_adapter test && ${COMPOSE_DEV} down

shell: build-dev
	${COMPOSE_DEV} run --rm --no-deps hancock_dlt_adapter /bin/bash && ${COMPOSE_DEV} down

docs: build-dev
	${COMPOSE_DEV} run --rm --no-deps hancock_dlt_adapter /bin/bash -c "npm run docs" && ${COMPOSE_DEV} down

db-shell-dev: build-dev
	${COMPOSE_DEV} run --rm --service-ports mongo-shell && ${COMPOSE_DEV} down

db-shell-prod:
	docker run -it --rm bitnami/mongodb:latest /bin/bash -c "mongo --host mongo.blockchainhub-develop.svc.cluster.local:27017 hancock"

db-init-dev: build-dev
	${COMPOSE_DEV} run --rm --service-ports mongo-shell /scripts/init_db.js && ${COMPOSE_DEV} down

contract-dev: build-dev
	${COMPOSE_DEV} run --rm --no-deps --service-ports hancock_dlt_adapter node /code/scripts/deploy_contracts.js && ${COMPOSE_DEV} down

down-dev:
	${COMPOSE_DEV} down