const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(
  'mongodb+srv://Bhanu:WST9vdr27GOMYvxN@cluster0.99nii.mongodb.net/Origa?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);

const app = express();

var userSchema = new mongoose.Schema({
  userId: Number,
  name: String,
  noOfOrders: { type: Number, default: 0 },
});

var User = mongoose.model('User', userSchema);

var orderSchema = new mongoose.Schema({
  orderId: Number,
  userId: Number,
  subtotal: Number,
  date: String,
});

var Order = mongoose.model('Order', orderSchema);

app.get('/', (req, res) => {
  Order.aggregate([
    {
      $group: {
        _id: '$userId',
        noOfOrders: { $sum: 1 },
        averageBillValue: { $avg: '$subtotal' },
      },
    },
    { $sort: { userId: 1 } },
  ]).exec((err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      res.send({ data: result });
    }
  });
});

app.listen(3000, () => {
  console.log('Listening to port 3000');
});
