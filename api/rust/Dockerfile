FROM rust:1.49

RUN rustup update nightly
RUN rustup default nightly

RUN mkdir -p /api/rust

WORKDIR /api/rust

COPY . .

RUN cargo build --release

EXPOSE 8000

CMD [ "target/release/rust" ]