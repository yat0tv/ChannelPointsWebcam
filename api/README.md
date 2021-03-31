# nodejs-twitch-webcam-rewards
Project that: 
- logs into twitch and generated access tokens which will allow the server to interact with twitch's helix api to work with channel rewards
- creates/updates/removes twitch channel rewards
  - rewards are related to webcam functionality used on the VueJS frontend
- listens for redemptions made by rewards created by this server

To install:
- npm install

To setup:
- rename .env_sample to .env
- populate your client ID & secret key into the corresponding variables in the .env file

To run:
- node server.js

Tested on:
- Windows 10
- nodejs version 14.16.0
- npm version 7.5.4

Your Application will need the OAuth Redirect URL http://localhost:8080/api/validate
