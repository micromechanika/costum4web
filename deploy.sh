#!/usr/bin/env sh

set -e

yarn prod

cd dist



git init

git add -A
git commit -m 'deploy'

# если вы публикуете по адресу https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:micromechanika/costum4web.git master:gh-pages


cd -
