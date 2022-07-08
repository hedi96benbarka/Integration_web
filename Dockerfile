# Stage 0, "build-stage"
FROM node:14.16.1-alpine as build-stage
WORKDIR /app
COPY package.json /app/
COPY yarn.lock /app/
ARG VERDACCIO_URL
RUN  npm set registry ${VERDACCIO_URL}
RUN yarn
COPY ./ /app/
RUN npm run build_prod

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.20
ARG GIT_COMMIT
LABEL GIT_COMMIT="${GIT_COMMIT}"
COPY --from=build-stage /app/dist/ /usr/share/nginx/html/Budget
COPY nginx.conf /etc/nginx/conf.d/default.conf
