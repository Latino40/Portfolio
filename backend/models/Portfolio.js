const mongoose = require('mongoose');

const skillItemSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  percent: { type: Number, default: 0 },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  tags: { type: [String], default: [] },
  github: { type: String, default: '' },
  demo: { type: String, default: '' },
  category: { type: String, default: '' },
}, { _id: false });

const timelineSchema = new mongoose.Schema({
  year: { type: mongoose.Schema.Types.Mixed, default: '' },
  title: { type: String, default: '' },
  text: { type: String, default: '' },
}, { _id: false });

const testimonialSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  text: { type: String, default: '' },
  rating: { type: Number, default: 5 },
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  profile: {
    greeting: { type: String, default: '' },
    name: { type: String, default: '' },
    titles: { type: [String], default: [] },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  about: {
    subtitle: { type: String, default: '' },
    paragraphs: { type: [String], default: [] },
    cards: {
      education: {
        title: { type: String, default: '' },
        text: { type: String, default: '' },
      },
      experience: {
        title: { type: String, default: '' },
        text: { type: String, default: '' },
      },
      achievements: {
        title: { type: String, default: '' },
        text: { type: String, default: '' },
      },
    },
  },
  skills: {
    programming: { type: [skillItemSchema], default: [] },
    frameworks: { type: [skillItemSchema], default: [] },
    tools: { type: [String], default: [] },
    soft: { type: [String], default: [] },
  },
  projects: { type: [projectSchema], default: [] },
  timeline: { type: [timelineSchema], default: [] },
  testimonials: { type: [testimonialSchema], default: [] },
  social: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    x: { type: String, default: '' },
  },
  contact: {
    location: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  stats: {
    projects: { type: Number, default: 0 },
    technologies: { type: Number, default: 0 },
    repos: { type: Number, default: 0 },
    hours: { type: Number, default: 0 },
  },
  cv: {
    name: { type: String, default: '' },
    size: { type: Number, default: 0 },
  },
  cv_url: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
