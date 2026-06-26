const Portfolio = require('../models/Portfolio');

const getPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = await Portfolio.create({});
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = new Portfolio();
    }

    const fields = [
      'profile', 'about', 'skills', 'projects',
      'timeline', 'testimonials', 'social',
      'contact', 'stats', 'cv', 'cv_url',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        portfolio[field] = req.body[field];
      }
    });

    const updated = await portfolio.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPortfolio, updatePortfolio };
