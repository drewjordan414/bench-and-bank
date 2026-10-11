# Bench & Bank: the built site plus the small trip-log endpoint, served by `vite preview`.
# ponytail: vite preview is the server because the endpoint already lives in vite.config.js. It is fine for one
# person on a home network; write a dedicated Node server before exposing this to the internet.
FROM node:22-alpine
WORKDIR /app/site
COPY site/package.json site/package-lock.json ./
RUN npm ci
COPY site/ ./
RUN npx vite build && mkdir -p /app/data && chown -R node:node /app
USER node
EXPOSE 5183
VOLUME /app/data
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD wget -qO /dev/null http://127.0.0.1:5183/ || exit 1
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5183", "--strictPort"]
