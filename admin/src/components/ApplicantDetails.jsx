import { Link, FileText, X, IdCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { applicantDetails } from '../services/applicants';
import { cleanDateTime } from '../utils/format';


export default function ApplicantDetails({ applicantId, onClose }) {

    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    const [data, setData] = useState({});
    const [blacklist, setBlacklist] = useState([]);

    useEffect(() => {
        try {
            const load = async () => {
                const { success, message, applicant, blacklist: apiBlacklist } = await applicantDetails(applicantId);
                if (success) {
                    setData(applicant);
                    setBlacklist(apiBlacklist);
                    return
                };
                console.error(message);
            }

            load();
        } catch (error) {
            console.error(error);
        }
    }, [applicantId]);

    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold">Applicant Details</p>
                <p className="text-sm text-gray-500 mb-8">
                    Complete profile for {data?.fullname}
                </p>
                <p className='text-lg font-semibold mb-4'>
                    Basic information
                </p>
                <section className='grid grid-cols-2 gap-4 mb-4'>
                    <div>
                        <p className='text-gray-500 text-sm'>Fullname</p>
                        <p className='text-sm'>{data?.fullname}</p>
                    </div>
                    <div>
                        <p className='text-gray-500 text-sm'>Email</p>
                        <p className='text-sm'>{data?.user?.email}</p>
                    </div>
                    <div>
                        <p className='text-gray-500 text-sm'>Phone Number</p>
                        <p className='text-sm'>{data?.phone}</p>
                    </div>
                    <div>
                        <p className='text-gray-500 text-sm'>Position Applied</p>
                        <p className='text-sm'>{data?.job?.jobTitle}</p>
                    </div>
                    <div>
                        <p className='text-gray-500 text-sm'>Company</p>
                        <p className='text-sm'>{data?.job?.company?.companyName}</p>
                    </div>
                    <div>
                        <p className='text-gray-500 text-sm'>Application Date</p>
                        <p className='text-sm'>{data?.createdAt && cleanDateTime(data?.createdAt)}</p>
                    </div>
                </section>

                <p className='text-lg font-semibold mb-4'>
                    Links & Documents
                </p>
                <section className='space-y-4 mb-4'>
                    {data?.linkedIn &&
                        <div className='flex gap-2 items-center'>
                            <Link className='text-gray-500' />
                            <div>
                                <p className='text-sm font-semibold text-gray-500'>LinkedIn Profile</p>
                                <a
                                    href={data?.linkedIn}
                                    target="_blank"
                                    className='text-emerald-500 text-sm'
                                >
                                    {data?.linkedIn}
                                </a>
                            </div>
                        </div>
                    }
                    {data?.portfolio &&
                        <div className='flex gap-2 items-center'>
                            <Link className='text-gray-500' />
                            <div>
                                <p className='text-sm font-semibold text-gray-500'>Profile Link</p>
                                <a
                                    href={data?.portfolio}
                                    target="_blank"
                                    className='text-emerald-500 text-sm'
                                >
                                    {data?.portfolio}
                                </a>
                            </div>
                        </div>
                    }
                    {data?.resume &&
                        <div className='flex gap-2 items-center'>
                            <FileText className='text-gray-500' />
                            <div>
                                <p className='text-sm font-semibold text-gray-500'>Resume</p>
                                <a
                                    href={`${API_URL}/uploads/resumes/${data?.resume}`}
                                    target="_blank"
                                    className='text-emerald-500 text-sm'
                                >
                                    View Resume
                                </a>
                            </div>
                        </div>
                    }
                    {data?.resume &&
                        <div className='flex gap-2 items-center'>
                            <IdCard className='text-gray-500' />
                            <div>
                                <p className='text-sm font-semibold text-gray-500'>Valid ID</p>
                                <a
                                    href={`${API_URL}/uploads/validIds/${data?.validId}`}
                                    target="_blank"
                                    className='text-emerald-500 text-sm'
                                >
                                    View Valid ID
                                </a>
                            </div>
                        </div>
                    }
                </section>

                {['Interview', 'Orientation', 'Hired'].includes(data?.applicantStatus) &&
                    <>
                        <p className='text-lg font-semibold mb-4'>
                            Interview Information
                        </p>
                        <section className='grid grid-cols-2 gap-4 mb-4'>
                            <div>
                                <p className='text-gray-500 text-sm'>Interview Date</p>
                                <p className='text-sm'>{data?.interviewAt ? cleanDateTime(data?.interviewAt) : '-'}</p>
                            </div>
                            <div>
                                <p className='text-gray-500 text-sm'>Interview Mode</p>
                                <p className='text-sm'>{data?.interviewMode || '-'}</p>
                            </div>
                            <div>
                                <p className='text-gray-500 text-sm'>Interview Location</p>
                                <p className='text-sm'>{data?.interviewLocation || '-'}</p>
                            </div>
                            <div>
                                <p className='text-gray-500 text-sm'>Intervuew Status</p>
                                <p className='text-sm'>{data?.interviewStatus}</p>
                            </div>
                        </section>
                    </>
                }

                {['Orientation', 'Hired'].includes(data?.applicantStatus) &&
                    <>
                        <p className='text-lg font-semibold mb-4'>
                            Orientation Information
                        </p>
                        <section className='grid grid-cols-2 gap-4 mb-4'>
                            <div>
                                <p className='text-gray-500 text-sm'>Orientation Date</p>
                                <p className='text-sm'>{data?.orientationEvent?.eventAt ? cleanDateTime(data?.orientationEvent?.eventAt) : '-'}</p>
                            </div>
                            <div>
                                <p className='text-gray-500 text-sm'>Orientation title</p>
                                <p className='text-sm'>{data?.orientationEvent?.eventTitle || '-'}</p>
                            </div>
                            <div>
                                <p className='text-gray-500 text-sm'>Orientation Location</p>
                                <p className='text-sm'>{data?.orientationEvent?.location || '-'}</p>
                            </div>
                            <div>
                                <p className='text-gray-500 text-sm'>Status</p>
                                <p className='text-sm'>{data?.orientationStatus}</p>
                            </div>
                        </section>
                    </>
                }

                {blacklist?.length > 0 &&
                    <>
                        <p className='text-lg font-semibold mb-4'>
                            Backlisted Records
                        </p>
                        <section className='space-y-4'>
                            {blacklist?.map((bl, index) => (
                                <div
                                    key={index}
                                    className='bg-red-500 text-white p-2 rounded-lg'
                                >
                                    <p className='text-sm font-bold'>{bl?.job?.jobTitle}</p>
                                    <p className='text-sm mb-4'>{bl?.job?.company?.companyName}</p>
                                    <p className='text-sm'>Reason:</p>
                                    <p className='text-sm'>
                                        {bl?.blacklistedReason}
                                    </p>
                                </div>
                            ))}
                        </section>
                    </>
                }
            </div>
        </div>
    )
}