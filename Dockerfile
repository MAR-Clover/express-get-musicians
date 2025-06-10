FROM node:18
COPY . /app
WORKDIR /app
CMD ["npm", "start"]
EXPOSE 3000