FROM ubuntu:20.04

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/autodba

# Install Prometheus
RUN wget -qO- https://github.com/prometheus/prometheus/releases/download/v2.55.1/prometheus-2.55.1.linux-amd64.tar.gz | tar -xzf - -C /tmp/ \
    && mkdir -p ./prometheus ./config/prometheus \
    && cp /tmp/prometheus-2.55.1.linux-amd64/prometheus ./prometheus/ \
    && cp /tmp/prometheus-2.55.1.linux-amd64/promtool ./prometheus/ \
    && cp -r /tmp/prometheus-2.55.1.linux-amd64/consoles ./config/prometheus/ \
    && cp -r /tmp/prometheus-2.55.1.linux-amd64/console_libraries ./config/prometheus/ \
    && rm -rf /tmp/prometheus-2.55.1.linux-amd64

# Prometheus config
COPY prometheus.yml ./config/prometheus/prometheus.yml

COPY prometheus-entrypoint.sh /usr/local/autodba/bin/prometheus-entrypoint.sh
RUN chmod +x /usr/local/autodba/bin/prometheus-entrypoint.sh

CMD ["/usr/local/autodba/bin/prometheus-entrypoint.sh"]
