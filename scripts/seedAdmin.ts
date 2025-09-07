import mongoose from 'mongoose';
import Admin from '../models/Admin';

// Database connection
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskup');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

async function seedAdmin() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      return;
    }

    // Create default admin user
    const adminData = {
      username: 'admin',
      email: 'admin@taskup.com',
      password: 'admin123', // This will be hashed by the pre-save middleware
      role: 'super_admin' as const,
      isActive: true,
      createdBy: 'system'
    };

    const admin = await Admin.create(adminData);

    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Username:', admin.username);
    console.log('🔑 Password: admin123');
    console.log('🛡️  Role:', admin.role);
    console.log('🔐 Permissions:', admin.permissions);
    console.log('\n🚀 You can now login to the admin panel with these credentials.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeder
if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log('🎉 Admin seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Admin seeding failed:', error);
      process.exit(1);
    });
}

export default seedAdmin;
