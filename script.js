#!/bin/sh

npm install

pm2 start npm --name pet-harmony-be -- run dev
