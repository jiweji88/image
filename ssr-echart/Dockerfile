FROM node:16.20-slim AS builder

ENV LANG C.UTF-8
# 更新apt源为debian oldstable以支持旧版本系统
RUN echo "deb http://deb.debian.org/debian oldstable main contrib non-free" > /etc/apt/sources.list && \
    echo "deb http://deb.debian.org/debian oldstable-updates main contrib non-free" >> /etc/apt/sources.list && \
    echo "deb http://security.debian.org/debian-security oldstable-security main contrib non-free" >> /etc/apt/sources.list && \
    apt-get update \
    && apt-get install -qq libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++ ttf-wqy-microhei \
    && rm -rf /var/lib/apt/lists/*

RUN ln /etc/fonts/conf.d/65-wqy-microhei.conf /etc/fonts/conf.d/69-language-selector-zh-cn.conf

WORKDIR /home/node/app
COPY package.json /home/node/app/
COPY package-lock.json /home/node/app/
COPY server.js /home/node/app/
RUN npm install --registry=https://registry.npm.taobao.org

FROM node:16.20-slim as prod
MAINTAINER lz1998
WORKDIR /home/node/app
# 更新apt源并安装必要字体
RUN echo "deb http://deb.debian.org/debian oldstable main contrib non-free" > /etc/apt/sources.list && \
    echo "deb http://deb.debian.org/debian oldstable-updates main contrib non-free" >> /etc/apt/sources.list && \
    echo "deb http://security.debian.org/debian-security oldstable-security main contrib non-free" >> /etc/apt/sources.list && \
    apt-get update \
    && apt-get install -qq ttf-wqy-microhei \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /home/node/app /home/node/app

CMD npm run serve
