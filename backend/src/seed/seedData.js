const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const Package = require('../models/Package');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Admin.deleteMany({});
    await Package.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin
    const admin = await Admin.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`✅ Admin created: ${admin.username} / admin123`);

    // Create sample packages
    const packages = await Package.insertMany([
      {
        title: 'Golden Triangle Express',
        route: ['Delhi', 'Agra', 'Jaipur', 'Delhi'],
        duration: '5 Days / 4 Nights',
        busType: 'AC',
        totalSeats: 59,
        price: 4500,
        description: 'Explore the iconic Golden Triangle — from the majestic Taj Mahal in Agra to the vibrant palaces of Jaipur. This premium AC bus tour covers the most iconic landmarks of North India with comfortable overnight stays and guided tours.',
        images: ['/images/golden-triangle-1.jpg', '/images/golden-triangle-2.jpg'],
        itinerary: [
          { day: 1, title: 'Delhi to Agra', description: 'Depart from Delhi early morning. Visit Sikandra and Agra Fort. Evening visit to Mehtab Bagh for Taj Mahal sunset view.' },
          { day: 2, title: 'Agra Exploration', description: 'Early morning Taj Mahal visit at sunrise. Explore local markets and handicraft shops. Afternoon at leisure.' },
          { day: 3, title: 'Agra to Jaipur', description: 'Travel to Jaipur via Fatehpur Sikri. Visit the abandoned Mughal city. Arrive Jaipur by evening.' },
          { day: 4, title: 'Jaipur Sightseeing', description: 'Visit Amber Fort, City Palace, Hawa Mahal, and Jantar Mantar. Evening bazaar shopping.' },
          { day: 5, title: 'Jaipur to Delhi', description: 'Morning departure to Delhi. Arrive by afternoon. Tour concludes.' },
        ],
        departureDate: new Date('2026-06-15'),
        isActive: true,
      },
      {
        title: 'Manali Mountain Adventure',
        route: ['Delhi', 'Chandigarh', 'Kullu', 'Manali'],
        duration: '7 Days / 6 Nights',
        busType: 'AC Sleeper',
        totalSeats: 59,
        price: 7500,
        description: 'Escape to the breathtaking mountains of Himachal Pradesh. Journey through scenic valleys, snow-capped peaks, and charming hill stations. Perfect for adventure seekers and nature lovers.',
        images: ['/images/manali-1.jpg', '/images/manali-2.jpg'],
        itinerary: [
          { day: 1, title: 'Delhi to Chandigarh', description: 'Overnight journey from Delhi. Arrive Chandigarh for breakfast and Rock Garden visit.' },
          { day: 2, title: 'Chandigarh to Kullu', description: 'Scenic drive through the Shivalik hills. Stop at Sundernagar Lake. Arrive Kullu by evening.' },
          { day: 3, title: 'Kullu Valley', description: 'White water rafting on Beas River. Visit Kullu Shawl factories and temples.' },
          { day: 4, title: 'Kullu to Manali', description: 'Drive to Manali. Visit Hadimba Temple, Van Vihar, and Mall Road.' },
          { day: 5, title: 'Solang Valley', description: 'Full day at Solang Valley. Paragliding, zorbing, and snow activities.' },
          { day: 6, title: 'Rohtang Pass', description: 'Excursion to Rohtang Pass (subject to weather). Stunning mountain views and snow play.' },
          { day: 7, title: 'Return Journey', description: 'Depart Manali. Overnight journey back to Delhi.' },
        ],
        departureDate: new Date('2026-07-01'),
        isActive: true,
      },
      {
        title: 'Rajasthan Heritage Tour',
        route: ['Delhi', 'Jaipur', 'Jodhpur', 'Udaipur', 'Delhi'],
        duration: '10 Days / 9 Nights',
        busType: 'AC',
        totalSeats: 59,
        price: 12000,
        description: 'A royal journey through the Land of Kings. Experience magnificent forts, serene lakes, vast deserts, and the rich cultural heritage of Rajasthan in this comprehensive heritage tour.',
        images: ['/images/rajasthan-1.jpg', '/images/rajasthan-2.jpg'],
        itinerary: [
          { day: 1, title: 'Delhi to Jaipur', description: 'Depart Delhi. Arrive Jaipur — the Pink City. Evening at leisure.' },
          { day: 2, title: 'Jaipur Exploration', description: 'Amber Fort elephant ride, City Palace, Hawa Mahal, local bazaars.' },
          { day: 3, title: 'Jaipur to Pushkar', description: 'Day trip to Pushkar. Visit Brahma Temple and Pushkar Lake.' },
          { day: 4, title: 'Jaipur to Jodhpur', description: 'Travel to the Blue City. Visit Umaid Bhawan Palace.' },
          { day: 5, title: 'Jodhpur Sightseeing', description: 'Mehrangarh Fort, Jaswant Thada, Clock Tower market, desert safari.' },
          { day: 6, title: 'Jodhpur to Udaipur', description: 'Scenic drive to Udaipur via Ranakpur Jain Temple.' },
          { day: 7, title: 'Udaipur — City of Lakes', description: 'Lake Pichola boat ride, City Palace, Saheliyon ki Bari.' },
          { day: 8, title: 'Udaipur Leisure', description: 'Free day for shopping and exploring local culture.' },
          { day: 9, title: 'Udaipur to Delhi', description: 'Begin return journey via highway. Overnight travel.' },
          { day: 10, title: 'Arrive Delhi', description: 'Early morning arrival in Delhi. Tour concludes.' },
        ],
        departureDate: new Date('2026-08-10'),
        isActive: true,
      },
      {
        title: 'Varanasi Spiritual Journey',
        route: ['Delhi', 'Lucknow', 'Varanasi'],
        duration: '4 Days / 3 Nights',
        busType: 'Non-AC',
        totalSeats: 59,
        price: 3200,
        description: 'Experience the spiritual heartbeat of India. Witness the mesmerizing Ganga Aarti, explore ancient temples, and immerse yourself in the timeless culture of Varanasi — one of the oldest living cities in the world.',
        images: ['/images/varanasi-1.jpg', '/images/varanasi-2.jpg'],
        itinerary: [
          { day: 1, title: 'Delhi to Lucknow', description: 'Depart Delhi. Visit Lucknow — Bara Imambara, Chhota Imambara. Evening street food tour.' },
          { day: 2, title: 'Lucknow to Varanasi', description: 'Travel to Varanasi. Evening Ganga Aarti at Dashashwamedh Ghat.' },
          { day: 3, title: 'Varanasi Exploration', description: 'Early morning boat ride on the Ganges. Visit Kashi Vishwanath Temple, Sarnath.' },
          { day: 4, title: 'Return to Delhi', description: 'Morning at leisure. Depart for Delhi. Overnight journey.' },
        ],
        departureDate: new Date('2026-06-01'),
        isActive: true,
      },
    ]);

    console.log(`✅ ${packages.length} packages created`);
    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedData();
