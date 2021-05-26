const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// import schema for model
const Soldier = require('./Soldier.js');

// connect to mongodb
const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.connect('mongodb://127.0.0.1');
db.once('open', () => console.log('mongodb connected.'));

//handle image
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

// server middleware
// handle static file for image
app.use('/uploads', express.static('uploads'))
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
app.use((req, res, next) => {
  console.log(req.method + ' request received.');
  next();
});

// get all soldiers
app.get('/api/soldiers', (req, res) => {
  // search query
  let search = {};
  if (req.query.search) {
    const searchItem = req.query.search;
    search = {
      $or: [
        { name: { $regex: searchItem, $options: 'i' } },
        { rank: { $regex: searchItem, $options: 'i' } }
      ]
    };
  }
  // sort query
  let { sortDirection, sortType } = req.query;
  // pagination query
  const pagination = {
    page: parseInt(req.query.page) || 0,
    limit: 7
  }
  const skipParams = req.query.skip === 'true' ? pagination.page * pagination.limit : 0;
  const limitParams = req.query.skip === 'true' ? pagination.limit : (pagination.page + 1) * pagination.limit;
  // get needed soldiers
  Soldier.find(search)
    .sort({ [sortType]: sortDirection })
    .populate('superior', 'name')
    .skip(skipParams)
    .limit(limitParams)
    .then((soldiers) => {
      res.status(200).json({ soldiers });
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    });
});

// get a specific soldier detail
app.get('/api/soldier/:soldierId', (req, res) => {
  Soldier.findById(req.params['soldierId'])
    .populate({
      path: 'superior',
      populate: [{ path: 'superior' }]
    })
    .populate({
      path: 'subordinates',
      populate: [{ path: 'superior' }]
    })
    .then((soldier) => {
      res.status(200).json({ soldier })
    })
    .catch((err) => {
      res.status(500).json()
    })
});

// add a new soldier
app.post('/api/soldier', upload.single('avastar'), (req, res) => {
  let newSoldier = new Soldier();
  newSoldier.name = req.body.name;
  newSoldier.rank = req.body.rank,
  newSoldier.sex = req.body.sex;
  newSoldier.startDate = req.body.startDate;
  newSoldier.phoneNumber = req.body.phoneNumber;
  newSoldier.email = req.body.email;
  newSoldier.superior = req.body.superior;
  if (req.file) {
    newSoldier.avastar = req.file.path;
    console.log(req.file.path);
  } else {
    newSoldier.avastar = 'uploads/2020-02-13T01:09:09.476Z145.jpeg'
  }
  newSoldier
    .save()
    .then((soldier) => {
      if (soldier.superior) {
        Soldier.findByIdAndUpdate(
          soldier.superior,
          { $push: { subordinates: soldier._id } }
        ).exec();
      }
    })
    .then(() => {
      Soldier.find({})
        .populate('superior', 'name').exec()
        .then((soldiers) => {
          res.status(200).json({ soldiers });
        })
        .catch((err) => {
          res.status(500).json({ error: err })
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// edit one exist soldier
app.put('/api/soldier/:soldierId', (req, res) => {
  Soldier.findByIdAndUpdate(req.params['soldierId'], req.body)
    .then((soldier) => {
      if (req.body.superior) {
        if (soldier.superior) {
          Soldier.findByIdAndUpdate(
            soldier.superior,
            { $pull: { subordinates: soldier._id } }
          ).exec();
        }
        Soldier.findByIdAndUpdate(
          req.body.superior,
          { $push: { subordinates: req.params['soldierId'] } }
        ).exec();
      }
      if (!req.body.superior) {
        if (soldier.superior) {
          Soldier.findByIdAndUpdate(
            soldier.superior,
            { $pull: { subordinates: soldier._id } }
          ).exec();
        }
        Soldier.update(
          { _id: soldier._id },
          { $unset: { superior: 1 } },
        ).exec();
      }
    })
    .then(() => {
      Soldier.find({})
        .populate('superior', 'name').exec()
        .then((soldiers) => {
          res.status(200).json({ soldiers });
        })
        .catch((err) => {
          res.status(500).json({ error: err })
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// delete one soldier
app.delete('/api/soldier/:soldierId', (req, res) => {
  Soldier.findByIdAndRemove(req.params['soldierId'])
    .then((soldier) => {
      if (soldier.superior) {
        Soldier.findByIdAndUpdate(
          soldier.superior,
          { $pull: { subordinates: soldier._id } }
        ).exec();
      }
      if (soldier.subordinates.length > 0) {
        Soldier.update(
          { _id: { $in: soldier.subordinates } },
          { $unset: { superior: 1 } }
        ).exec();
      }
    })
    .then(() => {
      Soldier.find({})
        .populate('superior', 'name').exec()
        .then((soldiers) => {
          res.status(200).json({ soldiers });
        })
        .catch((err) => {
          res.status(500).json({ error: err })
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.get('/api/superiors', (req, res) => {
  Soldier.find({})
    .then((superiors) => {
      res.status(200).json({ superiors });
    })
    .catch((err) => {
      res.status(500).json({ error: err })
    });
});

app.listen(5000, () => console.log('listening on port 5000!'));