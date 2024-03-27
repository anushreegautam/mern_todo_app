# Todo MERN Stack Application

## Client

To run the client in development mode, please run the following command and open [http://localhost:9000](http://localhost:9000) to view the content in browser.
```git 
npm start
```

## Server

To run the server, please create a `config.env` file in the server folder and add the following information in this file

```git 
ATLAS_URI=<YOUR_MONGO_URI>
PORT=3000
PRIVATE_RSA_KEY=<PRIVATE_RSA_KEY>
PUBLIC_RSA_KEY=<PUBLIC_RSA_KEY>
GMAIL_USERNAME=<YOUR_EMAIL_ADDRESS>
GMAIL_PASSWORD=<EMAIL_APP_PASSWORD>
BASE_URL_UI=http://localhost:9000
```

For `EMAIL_APP_PASSWORD`, please create an app password on the email address that you would like to use here.

After adding this file, please run the following command to start the server in development mode
```git 
npm run build:watch
```
