# Monolithic dockerfile for kmsuj website
# Should later be changed so that nginx is separated

FROM nginx:1.28.0-bookworm

ENV WEBSITE_DIR="/website"
ENV VIRTUAL_ENV="/opt/venv"
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install additional packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-venv npm && \
    python3 -m venv "$VIRTUAL_ENV" && \
    rm -rf /var/lib/apt/lists/*

ADD . $WEBSITE_DIR
ADD nginx.conf /etc/nginx/nginx.conf
RUN mkdir /etc/nginx/logs; \
    mkdir /static

# Setup python
RUN python -m pip install --no-cache-dir -r "$WEBSITE_DIR/requirements.txt"

EXPOSE 80/tcp

ENV DJANGO_LOGGING_ROOT="/var/log"
ENV DATABASE_ROOT_DIR="/db"

VOLUME /var/log /static /db /certs

ENTRYPOINT ["/bin/bash", "/website/entrypoint.sh"]
