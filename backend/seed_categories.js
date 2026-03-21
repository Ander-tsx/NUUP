const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if categories exist
    const count = await Category.countDocuments();
    if (count === 0) {
      const categories = [
        { name: 'Desarrollo Web', description: 'Frontend, Backend, y Fullstack' },
        { name: 'Diseño Gráfico', description: 'UI/UX, Logos, Branding' },
        { name: 'Traducción', description: 'Inglés, Español, etc.' },
        { name: 'Marketing Digital', description: 'SEO, SEM, Redes Sociales' },
        { name: 'Edición de Video', description: 'Postproducción, Animación' }
      ];
      await Category.insertMany(categories);
      console.log('Categories seeded successfully');
    } else {
      console.log('Categories already exist');
    }
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
