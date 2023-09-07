# Use a imagem oficial do Node.js como base
FROM node:lts-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todos os arquivos do seu projeto para o diretório de trabalho
COPY . .

# Exponha a porta em que a aplicação Vite estará em execução (geralmente a porta 3000)
EXPOSE 3000

# Comando para iniciar a aplicação quando o contêiner for iniciado
CMD ["npm", "run", "dev"]
