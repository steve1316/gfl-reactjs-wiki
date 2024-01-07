# Build stage. The image only needs the lockfile to install, so dependencies stay cached across
# source-only changes.
FROM node:22-alpine AS build

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./

# pnpm refuses packages published more recently than `minimumReleaseAge`, which is a sensible default
# against a freshly compromised release. It is disabled here only because the container resolves from
# scratch on every build, so a dependency that is simply new fails a build that a developer machine
# and CI both accept. The lockfile is pinned and reviewed, which is what the policy is protecting.
RUN pnpm config set minimumReleaseAge 0 \
	&& pnpm install --frozen-lockfile

COPY . .

# Pages serves the site from a subpath, a container serves it from the root. Same source, one switch.
ENV VITE_BASE=/
RUN pnpm build

# Serve stage.
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
