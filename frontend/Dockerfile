FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
# CRA + older deps sometimes need this
RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE 3000

# CRA in Docker should listen on all interfaces
ENV HOST=0.0.0.0

CMD ["npm", "start"]
