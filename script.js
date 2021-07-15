#!/bin/sh

echo "NPM INSTALL"
npm install

echo "RUN THE APPLICATION"
pm2 start npm --name pet-harmony-be -- run dev
