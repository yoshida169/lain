FROM ruby:3.2.5-slim

RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  pkg-config \
  curl \
  && curl -fsSL https://deb.nodesource.com/setup_24.x -o nodesource_setup.sh \
  && sudo -E bash nodesource_setup.sh \
  && sudo apt install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Gemfile* /app/
RUN bundle install

COPY package.json package-lock.json /app/
RUN npm install

COPY . /app

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]
