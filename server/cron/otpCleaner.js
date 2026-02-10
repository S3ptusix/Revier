import cron from "node-cron";
import Users from "../models/User.js";
import { Op } from "sequelize";

cron.schedule("*/5 * * * *", async () => {
    await Users.update(
        { otp: null, otpExpireAt: null },
        {
            where: {
                otpExpireAt: {
                    [Op.lt]: new Date()
                }
            }
        }
    );

    console.log("Expired OTPs cleaned");
});

