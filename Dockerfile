FROM ruby:3.2.5-slim

RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  pkg-config \
  curl \
  && curl -fsSL https://deb.nodesource.com/setup_24.x -o nodesource_setup.sh \
  && bash nodesource_setup.sh \
  && apt install -y nodejs \
  && rm -rf /var/lib/apt/lists/* \
  && useradd -m -u 1000 app

WORKDIR /app

COPY Gemfile* /app/
RUN bundle install

COPY package.json package-lock.json* /app/
RUN npm install

COPY . /app

RUN chown -R app:app /app

USER app

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]
