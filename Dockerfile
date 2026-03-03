FROM node:20-alpine
RUN apk add --no-cache openssl

EXPOSE 3000

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./

# Install all deps (--ignore-scripts skips postinstall patch which is Windows-only)
RUN npm ci --ignore-scripts && npm cache clean --force

COPY . .

RUN npm run build

CMD ["npm", "run", "docker-start"]
