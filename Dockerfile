FROM node:lts-alpine as base
WORKDIR /app
RUN ls
COPY dist/ .
COPY prisma ./prisma

FROM base as dependencies
RUN yarn --production
RUN yarn add apollo-server-express

FROM dependencies as prisma
RUN yarn add prisma --dev
RUN yarn prisma generate
COPY . .

FROM prisma as release
ENV PORT=3000
EXPOSE ${PORT}

CMD node ./src/main.js