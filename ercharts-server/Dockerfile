# 使用Ubuntu 20.04作为基础镜像
FROM ubuntu:20.04

# 设置非交互模式，避免安装过程中出现交互提示
ENV DEBIAN_FRONTEND=noninteractive
# 设置时区
ENV TZ=Asia/Shanghai

# 更换APT为阿里源
RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list && \
    sed -i s@/security.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list && \
    apt-get clean

# 更新系统并安装所需依赖
RUN apt-get update && apt-get install -y \
    pkg-config \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libpixman-1-dev \
    ttf-wqy-microhei \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 安装Node.js v22.18.0
RUN curl -fsSL https://nodejs.org/dist/v22.18.0/node-v22.18.0-linux-x64.tar.xz -o node.tar.xz \
    && tar -xJf node.tar.xz -C /usr/local --strip-components=1 \
    && rm node.tar.xz \
    && node -v \
    && npm -v

# 设置NPM阿里源
RUN npm config set registry https://registry.npmmirror.com/ && \
    npm config set disturl https://npmmirror.com/dist

# 创建工作目录
WORKDIR /app

# 复制package文件并安装依赖（利用缓存机制）
# COPY package.json package-lock.json ./
COPY package.json ./
RUN npm install express@4 echarts@5.4.3 jsdom@22.1.0 canvas@2.11.2

# 复制服务代码
COPY echarts-server.js .

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "echarts-server.js"]

    
