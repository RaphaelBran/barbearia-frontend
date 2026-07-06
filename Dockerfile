FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY cmd/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY cmd ./
COPY index.html ../
COPY styles.css ../
COPY script.js ../
COPY assets ../assets/

# Expose port
ENV PORT=3000
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
