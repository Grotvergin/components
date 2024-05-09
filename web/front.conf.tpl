server {
      listen 8888;
      server_name _;

      set $application 'nginx-jsonlog';

      access_log /var/log/nginx/access.log;
      error_log  /var/log/nginx/error.log error;

      root /usr/share/nginx/html;
      index index.html;
      add_header 'Access-Control-Allow-Origin' '*';

      location /api/ {
          proxy_pass <WEB_API_BASE_URL>;

          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Scheme $scheme;
          proxy_set_header Host $host;            
          proxy_set_header X-NginX-Proxy true;

          proxy_connect_timeout   5;
          proxy_intercept_errors  on; 

          rewrite ^/api(.*)$ $1 break;           
      }

      location / {
        try_files $uri $uri/ /index.html;
      }

      location /healthcheck {
        return 200 '200 OK';
        add_header Content-Type text/plain;
      }
}
