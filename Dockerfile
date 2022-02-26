# ===== build server ===== #
FROM node:16 as build-client

WORKDIR /app

# 拷贝 package 文件
COPY packages/client/package.json ./
COPY packages/client/package-lock.json ./

# 安装依赖
RUN npm ci

# 拷贝代码
COPY packages/client ./

# 编译代码
RUN npm run build

# ===== build server ===== #
FROM node:16 as build-server

WORKDIR /app

# 拷贝 package 文件
COPY packages/server/package.json ./
COPY packages/server/package-lock.json ./

# 安装依赖
RUN npm ci

# 拷贝代码
COPY packages/server ./

# 编译代码
RUN npm run build

# ===== runtime ===== #
FROM node:16 as runtime

# 设置环境变量
ENV NODE_ENV production
ENV PORT 80

# 设置工作目录
WORKDIR /app

# 安装命令行工具
RUN npm i -g @nest-boot/command

# 复制客户端文件
COPY --from=build-client /app/build/ ./client/

# 复制服务端文件
COPY --from=build-server /app/package.json ./
COPY --from=build-server /app/node_modules/ ./node_modules/
COPY --from=build-server /app/dist/ ./dist/

# 暴露端口
EXPOSE 80

CMD [ "npm", "run", "start:server" ]
