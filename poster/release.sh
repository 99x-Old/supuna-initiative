#!/bin/bash -e

apt update && apt install  openssh-client
mkdir -p ~/.ssh
echo "$SSH_PRIVATE_KEY" | tr -d '\r' > ssh_key
chmod 600 ssh_key

ssh -o StrictHostKeyChecking=no -i ssh_key supuna@35.240.147.222 << EOF
  cd ~/ennoble-x/poster;
  git pull
  COMPOSE_INTERACTIVE_NO_CLI=1 && born cm 'exec -T cli composer install --no-dev --prefer-dist --no-suggest --no-progress --ignore-platform-reqs'
EOF
