FROM golang:1.17.1-alpine3.14

RUN mkdir -p /api/go

WORKDIR /api/go

COPY . .

RUN go mod download

EXPOSE 4000

CMD ["go", "run", "src/main.go"]