const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

mongoose.connect('mongodb+srv://faeznz:faeznz@data.h3xudui.mongodb.net/miniproj?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
    });

const itemSchema = new mongoose.Schema({
    image: String,
    nama: String,
    harga: String,
    keterangan: String,
    rating: String,
    id:String,
    review: Array,
});

const Item = mongoose.model('Item', itemSchema);

const alamatSchema = new mongoose.Schema({
    label: String,
    alamat: String,
    nama: String,
    nomor: String,
    uuid: String,
});

const Alamat = mongoose.model('Alamat', alamatSchema);

app.get('/item', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

app.get('/item/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});

app.get('/item/:id/review', async (req, res) => {
    const itemId = req.params.id;
  
    try {
      const review = await Item.find({ itemId });
  
      res.status(200).json({ review });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

app.delete('/item/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

app.post('/item', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.json(savedItem);
        res.status(200).json({ message: 'Item post successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item' });
    }
});

app.post('/item/:id/review', async (req, res) => {
    const itemId = req.params.id;
    const reviews = req.body.review;
  
    try {
      const item = await Item.findById(itemId);
  
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      item.review.push(reviews);

      await item.save();
  
      res.status(200).json({ message: 'Review added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add review' });
    }
  });

app.put('/item/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item update successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

app.get('/alamat', async (req, res) => {
    try {
        const alamats = await Alamat.find();
        res.status(200).json(alamats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch alamat' });
    }
});

app.get('/alamat/:uuid', async (req, res) => {
    try {
        const alamatId = req.body.uuid;
        const alamat = await Alamat.find.uuid(alamatId);
        if (!alamat) {
            return res.status(404).json({ error: 'Alamat not found' });
        }
        res.status(200).json(alamat);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch alamat' });
    }
});

app.delete('/alamat/:id', async (req, res) => {
    try {
        const deletedAlamat = await Alamat.findByIdAndDelete(req.params.id);
        if (!deletedAlamat) {
            return res.status(404).json({ error: 'Alamat not found' });
        }
        res.status(200).json({ message: 'Alamat deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete alamat' });
    }
});

app.post('/alamat', async (req, res) => {
    try {
        const newAlamat = new Alamat(req.body);
        const savedAlamat = await newAlamat.save();
        res.status(200).json({
            message: 'Alamat post successfully',
            data: savedAlamat
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add alamat' });
    }
});


app.put('/alamat/:id', async (req, res) => {
    try {
        const updatedAlamat = await Alamat.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAlamat) {
            return res.status(404).json({ error: 'Alamat not found' });
        }
        res.status(200).json({ message: 'Alamat update successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update alamat' });
    }
});


app.get('/', (req, res) => {
    res.send('API for Mini Project');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
