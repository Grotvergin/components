FROM nginx:1.25.4-alpine-slim

WORKDIR /usr/share/nginx/html
COPY ./build .
EXPOSE 8888

RUN apk update && apk add bash

# prepare appliaction configuration, *.tpl should be ignored on include by host nginx container
COPY ./front.conf.tpl /etc/nginx/conf.d 
# prepare environment
COPY ./docker-entrypoint.sh /usr/share/nginx/html
RUN chmod +x /usr/share/nginx/html/docker-entrypoint.sh

ENTRYPOINT [ "/usr/share/nginx/html/docker-entrypoint.sh" ]

CMD ["/bin/sh", "-c", "nginx -g \"daemon off;\""]
