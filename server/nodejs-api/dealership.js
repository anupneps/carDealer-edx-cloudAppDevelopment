require('dotenv').config();
const express = require('express');
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');


const app = express();


console.log('CLOUDANT_API_KEY:', process.env.CLOUDANT_API_KEY);
console.log('CLOUDANT_URL:', process.env.CLOUDANT_URL);

const authenticator = new IamAuthenticator({ apikey: process.env.CLOUDANT_API_KEY });
const cloudant = new CloudantV1({ authenticator, serviceUrl: process.env.CLOUDANT_URL, plugins: 'promises' });
const DBNAME = 'dealerships';
//cloudant.setServiceUrl(process.env.CLOUDANT_URL);

app.get('/', (req, res) => {
    const {name} = req.query;
    res.send(`Hello ${name}!`);
});

app.get('/dealership', async (req, res) => {
    try {
        const response = await cloudant.postAllDocs({ db: DBNAME, includeDocs: true });
        const dealerships = response.result.rows.map(row => row.doc);
        res.json(dealerships);
    } catch (error) {
        res.send(error.message);
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});