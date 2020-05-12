Installation Steps:

1. git clone .
2. run command: cd folder
3. run command: npm install ---- to install all the dependencies
4. run command: npm test (nodemon) or npm start (pm2) start the server

To see upload file in browser URL: http://site_url/file_path for eg http://localhost:3000/uploads/uploader-15858951273822075944_20200318.pdf

Here mongodb is used as database and hosted at https://mlab.com/.
jsonwebtoken is used to create token for user authentication.
mutler and fs package used for uploading and removing file and validation added to allow images(png,jpg,gif) and pdf for uploading.
Field name: uploader ( for uploading files)

Use token for other api (upload,remove and listing) received from signin api in header:
Authorization: Bearer token

For transaction in mongodb You need to have replica server and to create replica server here are the command:

1. install run-rs command npm i run-rs if it fails then try: sudo npm install -g run-rs --unsafe-perm=true --allow-root
2. run this command:  run-rs --version 4.0.0
