FROM node:22-alpine
WORKDIR /app

# Note: this copy probably should be a bit more selective, .gitignore does not have to be in target image
# even for the build step
COPY . .
RUN npm install
RUN npm run build

# Note: most likely somewhere about here should happen 2nd step, which installs only dependencies required for app to run,
# not to build it, but if package size does not matter, it can be skipped with little to no consequences, so that's
# what I am doing here

ENV NEXT_PUBLIC_SERVER_ENDPOINT="http://backend:8000/api"
EXPOSE 3000
CMD ["npm", "run", "start"]