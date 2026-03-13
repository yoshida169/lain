FROM ruby:3.2

RUN apt-get update -qq && apt-get install -y \
  default-libmysqlclient-dev \
  default-mysql-client \
  pkg-config \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Gemfile* /app/

RUN bundle install

COPY . /app

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]
