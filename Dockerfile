FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY cmd/package*.json ./

# Install dependencies
RUN npm install

# Copy backend files
COPY cmd ./

# Copy frontend files to parent directory (as expected by server.js)
RUN mkdir -p /app/frontend
COPY index.html /app/frontend/
COPY styles.css /app/frontend/
COPY script.js /app/frontend/
COPY assets /app/frontend/assets/

# Set frontend directory (PORT will be injected by Railway)
ENV FRONTEND_DIR=/app/frontend

# Start the application (PORT will be injected by Railway via process.env.PORT)
CMD ["node", "server.js"]
