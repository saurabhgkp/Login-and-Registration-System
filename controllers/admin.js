
const PurchaseRequest = require("../models/PurchaseRequest");
const Books = require("../models/books");
const Users = require("../models/usres");


const asyncMiddleware = (handler) => {
  return async (req, res, next) => {
    try {
      if (req.body.role !== "admin") {
        return res.status(401).json({
          status: 0,
          message: "Request not authorized.",
        });
      }
      await handler(req, res, next);
    } catch (ex) {
      next(ex);
    }
  };
};

//create user
//updateProfile

exports.updateProfile = asyncMiddleware(async (req, res) => {
  const { email, name, age } = req.body;
  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.name = name;
  user.age = age
  await user.save();
  return res.json({ message: 'Profile updated successful' });
})

exports.getAllusers = asyncMiddleware(async (req, res) => {
  const alluser = await Users.find();
  return res.status(200).json({
    status: 1,
    message: alluser,
  })
})
exports.userActive = asyncMiddleware(async (req, res) => {
  const { id } = req.query;
  let data = await Users.findById(id);
  data.isActive = true
  data.save()
  return res.status(201).json({
    status: 1,
    message: "user active ",
  });
})
exports.userInactive = asyncMiddleware(async (req, res) => {
  const { id } = req.query;
  let data = await Users.findById(id);
  data.isActive = false
  data.save()
  return res.status(201).json({
    status: 1,
    message: "user inactive ",
  });
})

exports.addBook = asyncMiddleware(async (req, res) => {
  const { name, price } = req.body;
  const data = new Books({ name, price });
  await data.save();
  return res.status(201).json({
    status: 1,
    message: data,
  });

})
exports.getAllBooks = asyncMiddleware(async (req, res) => {
  const allBook = await Books.find();
  return res.status(200).json({
    status: 1,
    message: allBook,
  })

})

exports.getBookById = asyncMiddleware(async (req, res) => {
  const { id } = req.query;
  const data = await Books.findOne({ _id: id });
  return res.status(200).json({
    status: 1,
    message: "data fetch",
    data: data
  })
})

exports.updateBook = asyncMiddleware(async (req, res) => {
  const data = new Books(req.body);
  const { id } = req.query;
  await Books.findByIdAndUpdate(id, { data });
  return res.status(201).json({
    status: 1,
    message: data,
  });
})

exports.deleteBookById = asyncMiddleware(async (req, res) => {
  const { id } = req.query;
  const data = await Books.findByIdAndDelete(id)
  return res.status(200).json({
    status: 1,
    message: "DELETE successfully ",
  })
})

exports.RequestList = asyncMiddleware(async (req, res) => {
  const requests = await PurchaseRequest.find().populate('bookId');
  return res.status(200).json({
    status: 1,
    message: requests,
  })
})
exports.sellBook = asyncMiddleware(async (req, res) => {
  const { status, requestId } = req.body;
  const updatedRequest = await PurchaseRequest.findByIdAndUpdate(
    requestId,
    { status },
    { new: true }
  );
  if (!updatedRequest) {
    return res.status(404).json({ message: 'Purchase request not found' });
  }
  return res.status(200).json({
    status: 1,
    message: 'Purchase request updated successfully',
  });
})
