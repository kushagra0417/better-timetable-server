const Staff = require('../models/staff')

// TODO: update

exports.addStaff = async (req, res) => {
    const { email, name, role, noticePermission } = req.body;

    const staff = await Staff.find({ email });

    if (staff.length) {
        return res.sendStatus(409);
    }

    const newStaff = new Staff({ email, name, role, noticePermission });

    newStaff.save((err, staff) => {
        if (err) {
            return res.status(400).json({
                err: "Not able to save staff in DB"
            });
        } else {
            res.status(200).json({
                id: staff._id,
                name: staff.name,
                email: staff.email,
                role: staff.role,
                noticePermission: staff.noticePermission,
            });
        }
    });
}

exports.list = async (req, res) => {
    try {
        const staffs = await Staff.find({});

        let list = await staffs.map(staff => ({
            id: staff._id,
            email: staff.email,
            name: staff.name,
            role: staff.role,
        }));

        res.status(200).json({
            staffs: list
        });
    } catch (e) {
        res.status(500).json({
            err: 'Faced error'
        });
    }
}

exports.getDetails = async (req, res) => {
    const { email } = req.body;
    console.log(email);
    if (email) {
        const staff = await Staff.findOne({ email });

        res.status(200).json({
            email,
            name: staff.name,
            contactNumber: staff.contactNumber,
            role: staff.role,
            noticePermission: staff.noticePermission,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt
        });
    } else {
        res.status(400).json({
            message: 'user email required'
        });
    }
}

exports.update = async (req, res) => {
    try {
        const { id, name, role, noticePermission } = req.body;
        const staff = await Staff.findByIdAndUpdate(id, { $set: { name, role, noticePermission } }, { new: true });


        return res.status(200).json({ staff });
    } catch (e) {
        return res.status(500);
    }
}

exports._delete = async (req, res) => {
    try {
        const { id } = req.query;
        const staff = await Staff.findByIdAndDelete(id);
        console.log(id)
        return res.status(200).json({ staff });
    } catch (e) {
        return res.status(500);
    }
};
