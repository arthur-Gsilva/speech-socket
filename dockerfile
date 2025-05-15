FROM bluenviron/mediamtx:latest AS mediamtx

FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y ffmpeg

COPY . .

RUN npm install

COPY --from=mediamtx /mediamtx /usr/local/bin/mediamtx

COPY mediamtx.yml /app/mediamtx.yml

EXPOSE 3001
EXPOSE 8888
EXPOSE 8554  

CMD sh -c "mediamtx /app/mediamtx.yml & npm run dev"
