const User = require('./models/User');

async function tempUpdateAllPasswords() {
    try {
        console.log('Starting password update process...');
        
        // Get all users (no filters, get all at once by setting a large limit)
        const users = await User.findAll({}, 1, 1000);
        console.log(`Found ${users.length} users to update`);
        
        let successCount = 0;
        let failCount = 0;
        
        // Update each user's password to match their username
        for (const user of users) {
            try {
                await User.updatePassword(user.id, user.username);
                successCount++;
                console.log(`✓ Updated password for user: ${user.username}`);
            } catch (err) {
                failCount++;
                console.error(`✗ Failed to update password for user: ${user.username}`, err.message);
            }
        }
        
        console.log('\nPassword update summary:');
        console.log('------------------------');
        console.log(`Total users: ${users.length}`);
        console.log(`Successful updates: ${successCount}`);
        console.log(`Failed updates: ${failCount}`);
        
    } catch (error) {
        console.error('Error in tempUpdateAllPasswords:', error.message);
    }
}

// Execute the function
tempUpdateAllPasswords()
    .then(() => {
        console.log('Password update script completed');
        process.exit(0);
    })
    .catch(error => {
        console.error('Script failed:', error);
        process.exit(1);
    });