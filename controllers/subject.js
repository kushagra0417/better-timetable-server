const Subject = require("../models/subject");
const Lecture = require("../models/lecture");
// TODO: update

exports.add = async (req, res) => {
    const {
        shortName,
        longName,
        subjectType: type,
        programId
    } = req.body;

    const subject = new Subject({
        shortName,
        longName,
        type,
        programId
    });

    subject.save(async (err, _) => {
        if (err) {
            return res.status(400).json({
                err: "NOT able to save subject in DB"
            });
        }

        return res.json({
            id: subject._id
        });
    });
};

exports.get = async (req, res) => {
    try {
        const {
            programId
        } = req.query;
        const subjects = await Subject.find({
            programId
        });
        return res.status(200).json({
            subjects
        });
    } catch (e) {
        return res.status(500);
    }
}

exports._delete = async (req, res) => {
    try {
        const {
            id
        } = req.query;
        const subjects = await Subject.findByIdAndDelete(id);
        return res.status(200).json({
            subjects
        });
    } catch (e) {
        return res.status(500);
    }
};

exports.update = async (req, res) => {
    try {
        const {
            id,
            shortName,
            longName,
            type,
            programId
        } = req.body;
        const subject = await Subject.findByIdAndUpdate(id, {
            $set: {
                shortName,
                longName,
                type,
                programId
            }
        }, {
            new: true
        });
        return res.status(200).json({
            subject
        });
    } catch (e) {
        return res.status(500);
    }
}

exports.getElectives = async (req, res) => {
    try {
        let result = [];
        const { batchId } = req.query;
        const lectures = await Lecture.find({
            batchId
        });
        let subjectIds = lectures.map(lecture => {
            return lecture.subjectId.toString();
        });
        let distinctSubject = new Set(subjectIds);
        distinctSubject = [...distinctSubject];
        for (i = 0; i < distinctSubject.length; i++) {
            const subject = await Subject.findById(distinctSubject[i]);
            if (subject.type === 1) {
                result[i] = {
                    subjectId: subject._id,
                    shortName: subject.shortName,
                    longName: subject.longName
                }
            }
        }
        return res.status(200).json({
            result: result
        });
    } catch (e) {
        return res.status(500);
    }
}