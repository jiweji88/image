FROM node:12.18-slim AS builder

ENV LANG C.UTF-8
RUN sed -i 's/http:\/\/deb.debian.org\/debian/http:\/\/archive.debian.org\/debian/g' /etc/apt/sources.list && \
    sed -i 's/http:\/\/security.debian.org\/debian-security/http:\/\/archive.debian.org\/debian-security/g' /etc/apt/sources.list && \
    # 添加这一行忽略过期警告
    echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/10-nocheckvalid && \
    apt-get update \
    && apt-get install -qq libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++ ttf-wqy-microhei
RUN ln /etc/fonts/conf.d/65-wqy-microhei.conf /etc/fonts/conf.d/69-language-selector-zh-cn.conf

WORKDIR /home/node/app
COPY package.json /home/node/app/
COPY package-lock.json /home/node/app/
COPY server.js /home/node/app/
RUN npm install --registry=https://registry.npm.taobao.org

FROM node:12.19-slim as prod
MAINTAINER lz1998
WORKDIR /home/node/app
RUN sed -i 's/http:\/\/deb.debian.org\/debian/http:\/\/archive.debian.org\/debian/g' /etc/apt/sources.list && \
    sed -i 's/http:\/\/security.debian.org\/debian-security/http:\/\/archive.debian.org\/debian-security/g' /etc/apt/sources.list && \
    # 添加这一行忽略过期警告
    echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/10-nocheckvalid && \
    apt-get update \
    && apt-get install -qq ttf-wqy-microhei
COPY --from=builder /home/node/app /home/node/app

CMD npm run serve
