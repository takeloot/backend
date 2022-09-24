FROM node:lts-alpine as base
WORKDIR /app

COPY dist .
COPY prisma/migrations ./migrations
COPY prisma/schema.prisma ./schema.prisma
COPY schema.gql ./schema.gql

FROM base as dependencies
RUN yarn --production

FROM dependencies as prisma
RUN yarn add prisma --dev
RUN yarn prisma generate

FROM prisma as release
ENV PORT=3000
EXPOSE ${PORT}

CMD node ./main.js