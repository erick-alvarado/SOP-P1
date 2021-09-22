FROM rust:1.49

RUN rustup update nightly
RUN rustup default nightly

RUN mkdir -p /api/rust

WORKDIR /api/rust

COPY . .

RUN cargo build --release

CMD [ "./target/release/rust" ]