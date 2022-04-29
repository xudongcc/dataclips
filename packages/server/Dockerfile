# ===== build ===== #
FROM node:16-alpine as builder

WORKDIR /app

# 拷贝依赖文件
COPY package.json ./
COPY yarn.lock ./

# 安装依赖
RUN yarn

# 拷贝并编译代码
COPY ./ ./
RUN yarn build

# ===== runtime ===== #
FROM node:16-alpine as runner

# 设置环境变量
ENV PORT 80
ENV NODE_ENV production

# 设置工作目录
WORKDIR /app

# 安装全局工具
RUN npm install @nest-boot/command -g
RUN npm install  @mikro-orm/cli -g

# 复制文件
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

# 暴露端口
EXPOSE 80

CMD [ "node", "dist/main.js" ]
