require('dotenv').config();

const express = require('express');
const app = express();
const phantom = require('phantom');
const aws = require('aws-sdk');
const fs = require('fs');
const md5 = require('md5');

const port = process.env.PORT || 3000;
aws.config.region = process.env.AWS_REGION;
aws.config.update({ accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_KEY });

const sleep = (time) => new Promise(resolve => {
   setTimeout(() => resolve(), time);
});

const screenshot = async (url) => {
	console.log('Taking screenshot of', url, '...');

	const filename = 'screen.png';
	const instance = await phantom.create();
	const page = await instance.createPage();

	page.property('zoomFactor', 0.25);
	page.property('viewportSize',  { width: 300, height: 200 });
	page.property('clipRect', { top: 0, left: 0, width: 300, height: 200 });

	await page.open(url);
	await sleep(5000);
	await page.render(filename);
	await instance.exit();

	return filename;
};

const sendFileToS3 = async (url, filename) => new Promise(resolve => {
	console.log('Sending', filename, 'of', url, 'to S3...');

	const s3_key = 'screenshots/' + md5(url) + '.png';
	fs.readFile(filename, function(err, data) {
		if (err) throw err;

		var base64data = new Buffer(data, 'binary');

		var s3 = new aws.S3();
		s3.putObject({
			Bucket: process.env.AWS_S3_BUCKET,
			Key: s3_key,
			Body: base64data,
			ACL: 'public-read'
		}, () => {
			const final_url = 'https://s3-' + process.env.AWS_REGION + '.amazonaws.com/' + process.env.AWS_S3_BUCKET + '/' + s3_key;
			console.log('Successfully uploaded image at', final_url);
			resolve(final_url);
		});
	});
});

app.get('/', (req, res) => {
	res.send('hello world');
});

app.get('/take-screenshot', async (req, res) => {
	const url_to_shot = req.query.url;
	if (!url_to_shot) {
		res.send('Please provide an url as GET parameter');
	} else {
		const filename = await screenshot(url_to_shot);
		const url_final = await sendFileToS3(url_to_shot, filename);
		res.send(url_final);
	}
});

app.listen(port, function () {
	console.log('Website screenshot API listening on port', port);
});

