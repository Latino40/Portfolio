require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Portfolio = require('../models/Portfolio');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      await Admin.create({ username: 'admin', password: 'admin123' });
      console.log('Default admin created: username=admin, password=admin123');
    } else {
      console.log('Admin already exists, skipping...');
    }

    const existingPortfolio = await Portfolio.findOne();
    if (!existingPortfolio) {
      await Portfolio.create({
        profile: {
          greeting: "Hello, I'm",
          name: 'Sseruyange Marvin',
          titles: ['Software Engineering Student', 'Frontend Developer', 'Problem Solver'],
          description: 'Aspiring software engineer, passionate about coding and problem-solving.',
          image: '',
        },
        about: {
          subtitle: 'Software Engineering Student at Victoria University',
          paragraphs: [
            'Passionate first-year software engineering student dedicated to mastering the art of coding.',
            'Proficient in languages like Java, HTML, CSS, PHP, and JavaScript.',
          ],
          cards: {
            education: { title: 'Education', text: 'BSc Software Engineering\nVictoria University' },
            experience: { title: 'Experience', text: 'Frontend Projects\nWeb Applications' },
            achievements: { title: 'Achievements', text: 'Multiple Web Dev Projects\nProblem Solving' },
          },
        },
        social: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          instagram: 'https://instagram.com',
          whatsapp: 'https://wa.link/k17nbw',
          tiktok: 'https://tiktok.com',
          x: 'https://x.com',
        },
        contact: {
          location: 'Kampala, Uganda',
          email: 'sseruyangemarvin772@gmail.com',
          phone: '+256 XXX XXX XXX',
        },
        stats: { projects: 6, technologies: 12, repos: 15, hours: 500 },
      });
      console.log('Default portfolio document created');
    } else {
      console.log('Portfolio document already exists, skipping...');
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
