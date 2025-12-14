#!/usr/bin/env bash
# Install Composer locally in the project

set -e

EXPECTED_CHECKSUM="$(php -r 'copy("https://composer.github.io/installer.sig", "php://stdout");')"
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
ACTUAL_CHECKSUM="$(php -r "echo hash_file('sha384', 'composer-setup.php');")"

if [ "$EXPECTED_CHECKSUM" != "$ACTUAL_CHECKSUM" ]
then
    >&2 echo 'ERROR: Invalid installer checksum'
    rm composer-setup.php
    exit 1
fi

php composer-setup.php --quiet --install-dir=./backend --filename=composer.phar
RESULT=$?
rm composer-setup.php

if [ $RESULT -eq 0 ]; then
    echo "Composer installed successfully to backend/composer.phar"
    echo "You can use it with: php backend/composer.phar <command>"
else
    echo "Composer installation failed"
    exit $RESULT
fi
