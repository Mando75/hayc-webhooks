FROM denoland/deno:2.1.1

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno install --entrypoint main.ts

CMD ["task", "start"]
