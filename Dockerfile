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

# Expose port and set frontend directory
ENV PORT=3000
ENV FRONTEND_DIR=/app/frontend
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
