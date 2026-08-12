require('dotenv').config();
const supabase = require('../supabaseClient');

async function resetAdminPassword() {
    const adminId = 'cee98ef0-4716-46bf-aedb-02097830320f';
    const newEmail = 'eduvalues123@gmail.com';
    const newPassword = 'rmsmaha@123';

    console.log(`Attempting to reset credentials for admin user ID: ${adminId}...`);

    const { data, error } = await supabase.auth.admin.updateUserById(adminId, {
        email: newEmail,
        password: newPassword,
        user_metadata: { role: 'admin' },
        app_metadata: { role: 'admin' }
    });

    if (error) {
        console.error('❌ Failed to update credentials:', error.message);
    } else {
        console.log('✅ Successfully updated admin credentials!');
        console.log(`Email: ${newEmail}`);
        console.log(`New Password: ${newPassword}`);
        console.log('You can now log in with these credentials.');
    }
}

resetAdminPassword();
