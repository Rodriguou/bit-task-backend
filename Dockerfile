# Usa a imagem Node como base
FROM node:18-alpine

# Cria a pasta /backend dentro do contêiner
WORKDIR /backend

# Copia apenas os arquivos necessários para instalar as dependências
COPY package.json yarn.lock /backend/

# Instala as dependências
RUN yarn install --frozen-lockfile --production=false

# Copia o restante dos arquivos para o contêiner
COPY . /backend/

# Indica a porta em que a aplicação dentro do contêiner está sendo executada
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["yarn", "start"]
