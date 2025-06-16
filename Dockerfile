FROM public.ecr.aws/lambda/nodejs:18

# Copia package.json y package-lock.json e instala dependencias
COPY package*.json ./
RUN npm install --production

# Copia el código fuente
COPY . .

# Define el handler Lambda (ajusta si tu handler está en otro archivo)
CMD ["index.handler"]
