FROM node:20-alpine

WORKDIR /app

# Install dependencies needed for SQLite & Prisma
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run db:push
RUN npm run db:seed
RUN npm run build

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["npm", "start"]
