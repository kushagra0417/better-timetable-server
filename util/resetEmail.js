const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.sendResetEmail = async (email, newPassword, url) => {
    const verificationCode = jwt.sign({ email, newPassword }, process.env.JWT_SECRET);
    const emailBody = `Hi,
Click the link below to reset your password.
If you have not tried to reset please ignore.
Link: ${url}/auth/reset/${verificationCode}
    
Regards,
Better Timetable Team`;

    try {
        const sendMail = await axios.get(`https://www.mailshots.ml/api/?to=${email}&body=${emailBody}&as=Better%20Timetable&sub=Reset%20password%20verification%20for%20Better%20Timetable%20Staff%20login`);
        if (sendMail.data?.status === "SUCCESS") {
            return true;
        }
    } catch (e) {
        console.log(e);
    }
    return false;
}