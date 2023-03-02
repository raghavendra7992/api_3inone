const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const moment = require('moment');

const Product = require('./models/productModel.js');
const app = express();
const port = 3000;
mongoose.connect(`mongodb://localhost:27017`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });



app.get('/data', async (req, res) => {
  try {
    // Fetch JSON data from the API
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
    const data = response.data;

  
    await mongoose.connect(`mongodb://localhost:27017`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const result = await Product.insertMany(data);
    console.log(`${result.length} documents were inserted into the collection.`);
    res.send(`${result.length} documents were inserted into the collection.`);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while initializing the database.');
  } finally {
    await mongoose.disconnect();
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});




// API for total sale amount, total number of sold items, and total number of not sold items of selected month
app.get('/api/statistics/:month', async (req, res) => {
  try {
    const month = moment(req.params.month, 'YYYY-MM-DD').month();
    const year = moment(req.params.month, 'YYYY-MM-DD').year();
    const start = moment().set({ year, month, date: 1 }).startOf('day');
    const end = moment().set({ year, month, date: 1 }).endOf('month').endOf('day');
    const result = await Product.aggregate([
      { $match: { dateOfSale: { $gte: start.toDate(), $lte: end.toDate() } } },
      { $group: {
        _id: null,
        totalSaleAmount: { $sum: '$price' },
        totalSoldItems: { $sum: { $cond: ['$sold', 1, 0] } },
        totalNotSoldItems: { $sum: { $cond: ['$sold', 0, 1] } },
      } },
      { $project: { _id: 0 } },
    ]);
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error is their processing the request.');
  }
});



//BAR cahrt

app.get('/api/barchart/:month', async (req, res) => {
  try {
    const month = moment(req.params.month, 'YYYY-MM-DD').month();
    const year = moment(req.params.month, 'YYYY-MM-DD').year();
    const start = moment().set({ year, month, date: 1 }).startOf('day');
    const end = moment().set({ year, month, date: 1 }).endOf('month').endOf('day');
    const ranges = [
      { range: '0 - 100', min: 0, max: 100 },
      { range: '101 - 200', min: 101, max: 200 },
      { range: '201 - 300', min: 201, max: 300 },
      { range: '301 - 400', min: 301, max: 400 },
      { range: '401 - 500', min: 401, max: 500 },
      { range: '501 - 600', min: 501, max: 600 },
      { range: '601 - 700', min: 601, max: 700 },
      { range: '701 - 800', min: 701, max: 800 },
      { range: '801 - 900', min: 801, max: 900 },
      { range: '901 - above', min: 901, max: Infinity },
    ];
    const result = await Product.aggregate([
      {
        $match: {
          dateOfSale: { $gte: new Date(start), $lte: new Date(end) },
          sold: true,
        },
      },
      {
        $group: {
          _id: null,
          priceRanges: {
            $push: {
              range: {
                $reduce: {
                  input: ranges,
                  initialValue: '',
                  in: {
                    $cond: [
                      { $and: [{ $gte: ['$price', '$$this.min'] }, { $lte: ['$price', '$$this.max'] }] },
                      '$$this.range',
                      '',
                    ],
                  },
                },
              },
              count: { $sum: 1 },
            },
          },
        },
      },
      { $project: { _id: 0 } },
    ]);
    res.json(result[0]);
    console.log(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while processing the request.');
  }
});


//pie chart

app.get('/api/pie-chart/:month', async (req, res) => {
  try {
    const month = moment(req.params.month, 'YYYY-MM-DD').month();
    const year = moment(req.params.month, 'YYYY-MM-DD').year();
    const start = moment().set({ year, month, date: 1 }).startOf('day');
    const end = moment().set({ year, month, date: 1 }).endOf('month').endOf('day');
    const result = await Product.aggregate([
      { $match: { dateOfSale: { $gte: start.toDate(), $lte: end.toDate() } } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 }
      } }
    ]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while processing the request.');
  }
});


//combined api for alll
app.get('/api/combined/:month', async (req, res) => {
  try {
    const month = moment(req.params.month, 'YYYY-MM-DD').month();
    const year = moment(req.params.month, 'YYYY-MM-DD').year();
    const start = moment().set({ year, month, date: 1 }).startOf('day');
    const end = moment().set({ year, month, date: 1 }).endOf('month').endOf('day');

    const statisticsPromise = Product.aggregate([
      { $match: { dateOfSale: { $gte: start.toDate(), $lte: end.toDate() } } },
      { $group: {
        _id: null,
        totalSaleAmount: { $sum: '$price' },
        totalSoldItems: { $sum: { $cond: ['$sold', 1, 0] } },
        totalNotSoldItems: { $sum: { $cond: ['$sold', 0, 1] } },
      } },
      { $project: { _id: 0 } },
    ]);

    const barChartPromise = Product.aggregate([
      { $match: { dateOfSale: { $gte: start.toDate(), $lte: end.toDate() } } },
      { $group: {
        _id: { $floor: { $divide: ['$price', 100] } },
        count: { $sum: 1 },
      } },
      { $project: {
        _id: 0,
        priceRange: { $concat: [
          { $toString: { $multiply: ['$_id', 100] } },
          ' - ',
          { $toString: { $add: [{ $multiply: ['$_id', 100] }, 99] } },
        ] },
        count: 1,
      } },
    ]);

    const pieChartPromise = Product.aggregate([
      { $match: { dateOfSale: { $gte: start.toDate(), $lte: end.toDate() } } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 },
      } },
      { $project: { _id: 0, category: '$_id', count: 1 } },
    ]);

    const [statistics, barChart, pieChart] = await Promise.all([statisticsPromise, barChartPromise, pieChartPromise]);

    const result = {
      statistics: statistics[0],
      barChart: barChart,
      pieChart: pieChart,
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while processing the request.');
  }
});
