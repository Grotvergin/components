#!/bin/bash
#replace environment variables
rm -rf ./env-config.js
touch ./env-config.js
envs=$(printenv)
echo "window._env_ = {" >> ./env-config.js
for line in $envs
do
    if [[ $line == *"WEB_"* ]]; then
        if printf '%s\n' "$line" | grep -q -e '='; then
            varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
            varname=$(printf '%s\n' "$varname" | sed 's/WEB_//')
            varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
            echo "  $varname: \"$varvalue\"," >> ./env-config.js
            unset $varname # remove env variable
        fi
    fi
done
echo "}" >> ./env-config.js
config=$(cat ./env-config.js)
config=$(printf '%s\n' "$config" | sed -e 's/[]:"\/$*.~^[]/\\&/g');
config=$(printf '%s\n' "$config" | sed ':a;N;$!ba;s/\n/ /g');
sed -r -i -e 's|<script id="env-vars">(.*)</script><meta|<script id="env-vars">'"${config}"'</script><meta|g' /usr/share/nginx/html/index.html
rm -rf ./env-config.js

# replace nginx location (from env variable WEB_API_BASE_URL)
cp /etc/nginx/conf.d/front.conf.tpl /etc/nginx/conf.d/front.conf
sed -r -i -e 's|<WEB_API_BASE_URL>|'"${WEB_API_BASE_URL}"'|g' /etc/nginx/conf.d/front.conf

exec "$@"
