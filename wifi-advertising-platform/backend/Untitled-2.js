const User = require('../backend/models/User');

async function resetAllPasswords() {
    try {
        // Step 1: Fetch all users
        console.log('Fetching all users...');
        const users = await User.findAll();

        // Step 2: Update each user with a new hashed password
        console.log('Resetting passwords...');
        for (const user of users) {
            const newPassword = `password_${user.username}`; // Example: password concatenated with username
            const success = await User.updatePassword(user.id, newPassword);

            if (success) {
                console.log(`Password reset successfully for user: ${user.username}`);
            } else {
                console.error(`Failed to reset password for user: ${user.username}`);
            }
        }

        console.log('All passwords reset successfully!');
    } catch (err) {
        console.error('Error:', err);
    }
}

// Run the function
resetAllPasswords();