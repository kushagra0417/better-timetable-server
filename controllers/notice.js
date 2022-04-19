const Notice = require('../models/notice');
const Staff = require('../models/staff');

exports.add = async (req, res) => {
    const { body } = req.body;

    if (body.length < 20) {
        return res.status(400).json({
            success: false,
            err: "Notice too small",
        });
    }

    const notice = new Notice({
        email: req.auth.email,
        body,
        date: +new Date()
    });

    notice.save((err, _) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err: "Not able to add notice",
            });
        } else {
            res.status(200).json({
                success: true
            });
        }
    });
}


exports._delete = async (req, res) => {
    try {
        const { id } = req.body;
        const notice = await Notice.findOneAndDelete({ id });
        return res.status(200).json({
            notice
        });
    } catch (e) {
        return res.status(500);
    }
};


exports.get = async (req, res) => {
    let cached = {};
    try {
        const notices = await Notice.find({}).sort({ date: -1 });
        let result = [];
        for (i = 0; i < notices.length; i++) {
            let notice = notices[i];
            const { email } = notice;
            result[i] = { ...notice._doc };

            if (notice.email === process.env.ADMIN_EMAIL) {
                result[i].staffName = 'Admin';
            } else {
                if (cached[email]) {
                    result[i].staffName = cached[email];
                } else {
                    let staff = await Staff.findOne({ email }, { name: 1 });
                    result[i].staffName = staff.name;
                    cached[email] = staff.name;
                }
            }
        }

        return res.status(200).json({
            result
        });
    } catch (e) {
        return res.status(500);
    }
}