FROM node:22-alpine
WORKDIR /app

ENV DATABASE_URL="file:./prisma/dev.db"
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 8080

CMD ["sh", "start.sh"]
