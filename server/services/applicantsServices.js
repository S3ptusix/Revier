import { Applicants, Users, Jobs, Companies, ApplicantStatusHistory } from '../models/index.js'

// FETCH APPLICANTS PIPELINE
export const fetchApplicantPipelineService = async (adminId) => {
    try {

        let pipeline = {
            new: [],
            interview: [],
            orientation: [],
        }

        const statusNew = await Applicants.findAll({
            attributes: [
                'id',
                'fullname',
                'phone'
            ],
            include: [
                {
                    model: Users,
                    attributes: ['email']
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['jobTitle'],
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ],
            where: {
                applicantStatus: 'New'
            }
        });

        const statusInterview = await Applicants.findAll({
            attributes: [
                'id',
                'fullname',
                'phone',
                'interviewStatus',
                'interviewAt'
            ],
            include: [
                {
                    model: Users,
                    attributes: ['email']
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['jobTitle'],
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ],
            where: {
                applicantStatus: 'Interview'
            }
        });

        const statusOrientation = await Applicants.findAll({
            attributes: [
                'id',
                'fullname',
                'phone',
                'orientationStatus'
            ],
            include: [
                {
                    model: Users,
                    attributes: ['email']
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['jobTitle'],
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ],
            where: {
                applicantStatus: 'Orientation'
            }
        });

        pipeline.new = statusNew;
        pipeline.interview = statusInterview;
        pipeline.orientation = statusOrientation;

        return {
            success: true,
            pipeline,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// MOVE APPLICANT
export const moveApplicantService = async (applicantId, applicantStatus) => {
    try {

        if (
            isNaN(applicantId) ||
            !applicantStatus?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const applicantStatusArray = ['New', 'Interview', 'Orientation', 'Hired', 'Rejected'];

        applicantStatus = applicantStatusArray.includes(applicantStatus) ? applicantStatus : 'New';

        await Applicants.update({
            applicantStatus
        }, {
            where: { id: applicantId }
        });

        await ApplicantStatusHistory.create({
            applicantId,
            applicantStatus
        });

        return {
            success: true,
            message: "Applicant move successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// FETCH APPLICANT STATUS HISTORY
export const fetchApplicantStatusHistoryService = async (applicantId) => {
    try {

        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const applicantStatusHistory = await ApplicantStatusHistory.findAll({
            attributes: ['applicantStatus', 'createdAt'],
            where: { applicantId }
        });

        return {
            success: true,
            statusHistory: applicantStatusHistory
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// FETCH ALL INTERVIEWS
export const fetchAllInterviewsService = async (adminId) => {
    try {
        const applicants = await Applicants.findAll({
            attributes: [
                'id',
                'fullname',
                'interviewStatus',
                'interviewAt',
                'interviewLocation'
            ],
            include: [
                {
                    model: Users,
                    attributes: ['email']
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['jobTitle'],
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ],
            where: {
                applicantStatus: 'interview'
            }
        });

        return {
            success: true,
            applicants,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// SCHEDULE INTERVIEW
export const scheduleInterviewService = async (
    applicantId,
    interviewAt,
    interviewMode,
    interviewLocation,
    interviewNotes
) => {
    try {

        if (
            isNaN(applicantId) ||
            !interviewAt?.trim() ||
            !interviewMode?.trim() ||
            !interviewLocation?.trim() ||
            !interviewNotes?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            interviewAt,
            interviewMode,
            interviewLocation,
            interviewNotes
        }, {
            where: { id: applicantId }
        });

        return {
            success: true,
            message: "Applicant scheduled for interview successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// INTERVIEW RESULT
export const interviewResultService = async (applicantId, interviewStatus) => {
    try {

        if (
            isNaN(applicantId) ||
            !interviewStatus?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const interviewStatusArray = ['Passed', 'Failed'];

        interviewStatus = interviewStatusArray.includes(interviewStatus) ? interviewStatus : 'Passed';

        if (interviewStatus === 'Passed') {
            await Applicants.update({
                applicantStatus: 'Orientation',
                interviewStatus
            }, {
                where: { id: applicantId }
            });

            await ApplicantStatusHistory.create({
                applicantId,
                applicantStatus: 'Orientation'
            });
        } else {
            await Applicants.update({
                applicantStatus: 'Rejected',
                interviewStatus
            }, {
                where: { id: applicantId }
            });

            await ApplicantStatusHistory.create({
                applicantId,
                applicantStatus: 'Rejected'
            });
        }

        return { success: true }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}
