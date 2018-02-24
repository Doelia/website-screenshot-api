# Website screenshot API

A simple server to take screenshots of web pages

## Components

- Node.JS
- Express framework
- PhantomJS to take screenshots
- Aws S3 to store screenshots

## How to

**Installation**

```
npm install
```

**Configure with .env file or environment variables**
```
AWS_REGION=yourregion
AWS_ACCESS_KEY=youraccesskey
AWS_SECRET_KEY=yoursecretkey
AWS_S3_BUCKET=yourawss3bucketname
```

**Start server**
```
npm start
```

**Exemple usage**


Got to *http://localhost:3000/take-screenshot?url=https://github.com*

Then found the screenshot on your S3 bucket with a base64 of website name

**Result logs**

```
Website screenshot API listening on port 3000
Taking screenshot of https://github.com ...
Sending screen.png of https://github.com to S3...
Successfully uploaded image at https://s3-eu-west-3.amazonaws.com/my-bucket/screenshots/3097fca9b1ec8942c4305e550ef1b50a.png
```


