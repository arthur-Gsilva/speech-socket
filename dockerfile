# Etapa 1: Baixa MediaMTX oficial
FROM bluenviron/mediamtx:latest AS mediamtx

# Etapa 2: Prepara app Node
FROM node:18

WORKDIR /app

# Copia o código-fonte
COPY . .

# Instala dependências
RUN npm install

# Copia binário do MediaMTX
COPY --from=mediamtx /mediamtx /usr/local/bin/mediamtx

# Copia config
COPY mediamtx.yml /app/mediamtx.yml

# Expõe portas necessárias
EXPOSE 3001
EXPOSE 8888

# Roda MediaMTX e o backend
CMD sh -c "mediamtx /app/mediamtx.yml & npm run dev"
