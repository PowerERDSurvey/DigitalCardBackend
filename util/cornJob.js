const cron = require('node-cron');
const userSubscriptionModel = require("../models/mvc_userSubscription");
const { Op } = require('sequelize');
const userModel = require('../models/mvc_User');
const cardModel = require('../models/mvc_BusinessCard');
const layoutModel = require('../models/mvc_layout');
const themeModel = require('../models/mvc_theme');

// Schedule the job to run every day at 12:00 PM
cron.schedule('0 12 * * *', async () => {
    console.log('Running daily subscription check...');

    try {
        // Get the current date
        const currentDate = new Date();

        // Find subscriptions that are ending today
        const subscriptionsToDeactivate = await userSubscriptionModel.getAllUserSubscriptionByQuery({
            where: {
                endDate: {
                    [Op.lte]: currentDate // Subscriptions that end today or earlier
                },
                isActive: true // Only active subscriptions
            }
        });
        // Deactivate subscriptions
        for (const subscription of subscriptionsToDeactivate) {
            if (!subscription.companyId) {
                subscription.isActive = false; // Set to inactive
                await subscription.save(); // Save the changes
                console.log(`Deactivated subscription for userId: ${subscription.userId}`);
                const userDeatil = await userModel.getUser(subscription.userId);


                if (subscription.cardCount && userDeatil.cardAllocationCount >= subscription.cardCount) {
                    userDeatil.cardAllocationCount = (userDeatil.cardAllocationCount - subscription.cardCount);
                } else if (subscription.cardCount) {
                    userDeatil.createdcardcount = (userDeatil.createdcardcount - subscription.cardCount)
                }



                const user_last_Active_cards = await cardModel.getCardByQuery({
                    where: {
                        userId: subscription.userId
                    },
                    order: [['updatedAt', 'DESC']], // Order by updatedAt in descending order
                    limit: subscription.cardCount
                });
                if (user_last_Active_cards.length > 0) {
                    for (let index = 0; index < user_last_Active_cards.length; index++) {

                        user_last_Active_cards[index].isActive = false;
                        await user_last_Active_cards[index].save();
                        const themeCollection = await themeModel.getThemeByCardId(user_last_Active_cards[index].id);
                        themeCollection.layoutId = 1;
                        themeCollection.save();
                    }
                }
                await userDeatil.save();

            }


        }



        console.log('Daily subscription check completed.');
    } catch (error) {
        console.error('Error during subscription check:', error);
    }
}, {
    scheduled: true,
    timezone: "UTC" // Specify the timezone as UTC
});

console.log('Cron job scheduled to run every day at 12:00 PM.');