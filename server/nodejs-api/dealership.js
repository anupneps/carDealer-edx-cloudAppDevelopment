require('dotenv').config();
const express = require('express');
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.json());

console.log('CLOUDANT_API_KEY:', process.env.CLOUDANT_API_KEY);
console.log('CLOUDANT_URL:', process.env.CLOUDANT_URL);

const authenticator = new IamAuthenticator({ apikey: process.env.CLOUDANT_API_KEY });
const cloudant = new CloudantV1({ authenticator, serviceUrl: process.env.CLOUDANT_URL, plugins: 'promises' });
const DBNAME = 'dealerships';

app.get('/', (req, res) => {
    const { name } = req.query;
    res.send(`Hello ${name}!`);
});

app.get('/dealership', async (req, res) => {
    try {
        const { state } = req.query;
        //console.log('state:', state);
        let dealerships = [];
        const response = await cloudant.postAllDocs({ db: DBNAME, includeDocs: true });
        dealerships = response.result.rows.map(row => row.doc);
        //console.log('dealerships:', dealerships);

        if(dealerships.length === 0) return res.status(404).json({ error: 'No dealerships found' });
        
        if(state){
            const delearshipByState = dealerships.filter(dealership => {
                dealership.state.trim().toLowerCase() === state.trim().toLowerCase()
            });
            console.log('delearshipByState:', delearshipByState);
            if(delearshipByState.length === 0) return res.status(404).json({ error: 'No dealerships found with the state name '+ state });   
            return res.json(delearshipByState);
        } 

        res.json(dealerships);
            
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/dealership/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const response = await cloudant.postAllDocs({ db: DBNAME, includeDocs: true });
      const filteredDealerships = response.result.rows.filter(row => row.doc.id === parseInt(id));

      if (filteredDealerships.length > 0) {
        // Extract the 'doc' property from the filtered result
        const dealer = filteredDealerships.map(row => row.doc);
        res.send(dealer);
      } else {
        // If no dealership matches the provided id, return a 404 error
        res.status(404).json({ error: 'Dealership not found' });
      }
    } catch (error) {
      // If any other error occurs during the database operation, return a 500 error
      res.status(500).json({ error: error.message });
    }
  });

app.get('/dealership/:id/review', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await cloudant.postAllDocs({ db: 'reviews', includeDocs: true });
        const filteredDealerships = response.result.rows.filter(row => row.doc.id === parseInt(id));

        if (filteredDealerships.length > 0) {
            // Extract the 'doc' property from the filtered result
            const dealer = filteredDealerships.map(row =>{
                const{id, name, dealership, review, purchase, purchase_date, car_make, car_model, car_year} =row.doc;
                return {id, name, dealership, review, purchase, purchase_date, car_make, car_model, car_year};
            }); 
            
            res.send(dealer);
        } else {
            // If no dealership matches the provided id, return a 404 error
            res.status(404).json({ error: 'Dealership not found' });
        }
    } catch (error) {
        // If any other error occurs during the database operation, return a 500 error
        res.status(500).json({ error: error.message });
    }
});

app.post('/dealership/:id/review', async (req, res) => {
    const {id} = req.params;
    const {review} = req.body;
    try{
        const response = await cloudant.postAllDocs({ db: 'reviews', includeDocs: true });
        const existingReview = response.result.rows.find(row => row.doc.id === parseInt(id));

        if (existingReview.result) {
            const reviewResponse = await db.postDocument({ db: 'reviews',
            id: id,
            document: {
                ...review,
                _id: existingReview.result._id,
                _rev: existingReview.result._rev, 
            },});
            
            res.json(reviewResponse);
        }
       
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});