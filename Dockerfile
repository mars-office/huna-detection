FROM node:alpine
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm i
COPY . .
RUN npm run build
ARG TARGETPLATFORM
RUN [ "$TARGETPLATFORM" = "linux/amd64" ] && npm run test || echo "Skipping tests on ARM64"

ARG DEPLOYABLE_VERSION
ENV DEPLOYABLE_VERSION=${DEPLOYABLE_VERSION}

CMD npm run prod

EXPOSE 3004
LABEL org.opencontainers.image.source=https://github.com/mars-office/huna-detection