FROM dev.docker.kickstartteam.es:5000/kst/nodejs:onbuild-7.4.0

RUN rm .npmrc

EXPOSE 9000
