# Etapa 1: Baixa MediaMTX
FROM alfg/mediamtx:latest AS mediamtx

# Etapa 2: Prepara app Node
FROM node:18

# Diretório de trabalho
WORKDIR /app

# Copia o código-fonte
COPY . .

# Instala dependências
RUN npm install

# Copia binário do MediaMTX da imagem anterior
COPY --from=mediamtx /mediamtx /usr/local/bin/mediamtx

# Copia a config do MediaMTX
COPY mediamtx.yml /app/mediamtx.yml

# Expõe as portas
EXPOSE 3001
EXPOSE 8888

# Roda MediaMTX e sua app Node.js juntos
CMD sh -c "mediamtx /app/mediamtx.yml & npm run dev"
