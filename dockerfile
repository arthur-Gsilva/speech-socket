# Etapa 1: Baixa MediaMTX
FROM bluenviron/mediamtx:latest AS mediamtx

# Etapa 2: App Node
FROM node:18

WORKDIR /app

COPY . .

RUN npm install

COPY --from=mediamtx /mediamtx /usr/local/bin/mediamtx
COPY mediamtx.yml /app/mediamtx.yml

# Instala utilitário para aguardar porta
RUN npm install -g wait-port

EXPOSE 3001
EXPOSE 8888

# Espera MediaMTX iniciar antes de rodar backend
CMD sh -c "mediamtx /app/mediamtx.yml & wait-port localhost:8888 && npm run dev"
