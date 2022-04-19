const Lecture = require("../models/lecture");
const Subject = require("../models/subject");
const Staff = require("../models/staff");


exports.add = async (req, res) => {

    const {
        staffId,
        subjectId,
        division,
        day,
        date,
        time,
        batchId
    } = req.body;

    const lecture = new Lecture({

        staffId,
        subjectId,
        division,
        day,
        date,
        time,
        batchId
    });

    if (time['from'] > time['to'] || time['from'] === time['to']) {
        return res.status(400).json({
            err: "Lecture timing invalid"
        });
    }
    if (time['from'] < 0000 || time['from'] > 2400 || time['to'] < 0000 || time['to'] > 2400) {
        return res.status(400).json({
            err: "Lecture timing invalid"
        });
    }



    const lectures = await Lecture.find({
        $and: [{
            division: division
        }, {
            batchId: batchId
        }]
    });


    for (let i = 0; i < lectures.length; i++) {

        let isDaySame = false;

        for (let j = 0; j < lectures[i].day.length; j++) {
            if (day.includes(lectures[i].day[j])) {
                isDaySame = true;
            }
        }

        if (isDaySame) {
            if ((lectures[i].time.to > time.from && lectures[i].time.from < time.to) ||
                (lectures[i].time.to === time.to && lectures[i].time.from === time.from)) {
                return res.status(400).json({
                    err: "Lecture timing overlapping"
                });
            }
        }
    }


    lecture.save(async (err) => { // remove the param (to review)
        if (err) {
            return res.status(400).json({
                err: "NOT able to save lecture in DB"
            });
        }

        return res.json({
            id: lecture._id
        });
    });
};

exports._delete = async (req, res) => {
    try {

        const {
            id
        } = req.query;

        const lectures = await Lecture.findByIdAndDelete(id);
        return res.status(200).json({
            lectures
        });
    } catch (e) {
        return res.status(500);
    }
}

exports.update = async (req, res) => {
    try {
        const {
            id,
            staffId,
            subjectId,
            division,
            day,
            date,
            time,
            batchId
        } = req.body;
        const lectures = await Lecture.findByIdAndUpdate(id, {
            $set: {
                staffId,
                subjectId,
                division,
                day,
                date,
                time,
                batchId
            }
        }, {
            new: true
        });

        return res.status(200).json({
            lectures
        });
    } catch (e) {
        return res.status(500);
    }
};



// program, batch, div

exports.get = async (req, res) => {
    let result = []
    try {
        const {
            batchId,
            division
        } = req.query;

        const lectures = await Lecture.find({
            $and: [{
                batchId: batchId
            }, {
                division: division
            }]
        })
        for (i = 0; i < lectures.length; i++) {
            const subId = lectures[i].subjectId.toString();
            let staffId = lectures[i].staffId.toString();
            let subjectDetails = await Subject.findById(subId)
            let staffDetails = await Staff.findById(staffId)
            if (staffDetails && subjectDetails && lectures[i]) {
                result[i] = {
                    id: lectures[i]._id,
                    name: staffDetails.name,
                    shortName: subjectDetails.shortName,
                    longName: subjectDetails.longName,
                    type: subjectDetails.type,
                    time: lectures[i].time,
                    day: lectures[i].day,
                    date: lectures[i].date
                }

            }
        }
        return res.status(200).json({
            result: result
        });
    } catch (e) {
        console.log(e)
        console.log("hello")
        return res.status(500);
    }
};