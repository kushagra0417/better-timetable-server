const Batch = require("../models/batch");
const Lecture = require("../models/lecture");
const Program = require("../models/program");

exports.add = async (req, res) => {
    const { shortName, longName, programId, divisions } = req.body;

    const batch = new Batch({
        shortName,
        longName,
        programId,
        divisions
    });

    batch.save(async (err) => { // remove the param (to review)
        if (err) {
            // console.log(err);
            return res.status(400).json({
                err: "NOT able to save subject in DB"
            });
        }

        return res.json({
            id: batch._id
        });
    });
};

exports.get = async (req, res) => {
    try {
        const { programId } = req.query;
        const batches = await Batch.find({ programId });
        return res.status(200).json({ batches });
    } catch (e) {
        return res.status(500);
    }
}

exports.update = async (req, res) => {
    try {
        const { id, shortName, longName, programId, divisions } = req.body;
        const batch = await Batch.findByIdAndUpdate(id, { $set: { shortName, longName, programId, divisions } }, { new: true });
        return res.status(200).json({ batch });
    } catch (e) {
        return res.status(500);
    }
}

exports._delete = async (req, res) => {
    try {
        const { id } = req.body;
        const batch = await Batch.findByIdAndDelete(id);
        return res.status(200).json({ batch });
    } catch (e) {
        return res.status(500);
    }
}

exports.getDivision = async (req, res) => {
    try {
        const { batchId } = req.query;
        const batches = await Batch.findById(batchId);
        return res.status(200).json({ divisions: batches.divisions });
    } catch (e) {
        return res.status(500);
    }
}

exports.getBatchDetails = async (req, res) => {
    try {
        const { batchId } = req.query;
        const batch = await Batch.findById(batchId);
        const program = await Program.findById(batch.programId);
        let batchName = program.shortName + ' ' + batch.shortName;
        const lectures = await Lecture.find({ batchId: batchId });
        let staffNumbers = lectures.map(lecture => {
            return lecture.staffId.toString()
        })
        let distinctStaff = new Set(staffNumbers)
        totStaff = distinctStaff.size;

        let subjectNumbers = lectures.map(lecture => {
            return lecture.staffId.toString()
        })
        let distinctSubjects = new Set(subjectNumbers)
        totSubs = distinctSubjects.size;

        return res.status(200).json({ name: batchName, totalTeachers: totStaff, totalSubjects: totSubs });
    } catch (e) {
        // console.log(e)
        return res.status(500);
    }
}