# 使用官方Node.js镜像作为基础
FROM node:16-slim

# 安装canvas依赖的系统库
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# 创建工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装npm依赖
RUN npm install

# 复制应用代码
COPY generate-echarts-image.js .

# 运行脚本
CMD ["node", "generate-echarts-image.js"]
