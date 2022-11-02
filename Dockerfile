FROM node:lts-alpine as base
WORKDIR /app

COPY dist/ .
COPY prisma/migrations ./migrations
COPY prisma/schema.prisma ./schema.prisma
COPY prisma/seed.ts ./seed.ts
COPY schema.gql ./schema.gql

FROM base as dependencies
RUN yarn global add pnpm
RUN pnpm i --save-prod

FROM dependencies as prisma
RUN pnpm add prisma --save-dev
RUN pnpm prisma generate
COPY . .

FROM prisma as release
ENV PORT=3333
EXPOSE ${PORT}

CMD node ./src/main.js