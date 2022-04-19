const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.sendVerifyEmail = async (name, email, url) => {
    const verificationCode = jwt.sign({ email }, process.env.JWT_SECRET);
    const emailBody = `Hi ${name},
Click the link below to verify your email and complete the signup process.
If you have not tried to signup please ignore.
Link: ${url}/auth/verifyEmail/${verificationCode}
    
Regards,
Better Timetable Team`;

    try {
        const sendMail = await axios.get(`https://www.mailshots.ml/api/?to=${email}&body=${emailBody}&as=Better%20Timetable&sub=Email%20Verification%20for%20Better%20Timetable%20Staff%20login`);
        if (sendMail.data?.status === "SUCCESS") {
            return true;
        }
    } catch (e) {
        console.log(e);
    }
    return false;
}