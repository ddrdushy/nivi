FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Generate Prisma Client during build
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
