# Use official Node.js image as the base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or bun.lockb if using Bun)
COPY package.json ./
COPY bun.lockb ./

# Install dependencies (use npm, yarn, or bun as appropriate)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# ...existing code...
# Expose the port your app runs on (change if needed)
EXPOSE 4173

# Start the app
CMD ["npm", "run", "preview", "--", "--port", "4173"]
