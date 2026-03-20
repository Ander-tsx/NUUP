const Gig = require('../models/Gig');

const createGig = async (req, res) => {
  if (!req.isSeller) return res.status(403).json({ message: "Only sellers can create a gig!" });
  
  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (gig.userId !== req.userId) return res.status(403).json({ message: "You can delete only your gig!" });
    
    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Gig has been deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found!" });
    res.status(200).json(gig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGigs = async (req, res) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { category: q.cat }),
    ...((q.min || q.max) && {
      price: { ...(q.min && { $gte: q.min }), ...(q.max && { $lte: q.max }) }
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } })
  };

  try {
    const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
    res.status(200).json(gigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createGig, deleteGig, getGig, getGigs };
