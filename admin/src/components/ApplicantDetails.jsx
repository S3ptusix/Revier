import { Link, FileText, X, IdCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cleanDateTime } from '../utils/format';
import { applicantDetails } from '../services/applicants';


export default function ApplicantDetails({ applicantId, onClose }) {

    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    const [tab, setTab] = useState(1);
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
            <div className='h-full flex flex-col'>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold">Applicant Details</p>
                <p className="text-sm text-gray-500 mb-8">
                    Complete profile for {data?.fullname}
                </p>

                <div className='flex mb-4'>
                    <button
                        className={`btn border-0 rounded-none flex-1 ${tab === 1 ? 'bg-emerald-500 text-white' : ''}`}
                        onClick={() => setTab(1)}
                    >
                        Details
                    </button>
                    <button
                        className={`btn border-0 rounded-none flex-1 ${tab === 2 ? 'bg-emerald-500 text-white' : ''}`}
                        onClick={() => setTab(2)}
                    >
                        History
                    </button>
                    <button
                        className={`btn border-0 rounded-none flex-1 ${tab === 3 ? 'bg-emerald-500 text-white' : ''}`}
                        onClick={() => setTab(3)}
                    >
                        Blacklist
                    </button>
                </div>

                {tab === 1 && (
                    <section className='grow overflow-auto'>
                        <p className='text-lg font-semibold mb-4'>
                            Basic information
                        </p>
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                            <div>
                                <p className='text-gray-500 text-sm'>Fullname</p>
                                <p className='text-sm'>{data?.firstName} {data?.lastName}</p>
                            </div>
                            <div>
                                <p className='text-gray-500 text-sm'>Sex</p>
                                <p className='text-sm'>{data?.sex}</p>
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
                        </div>

                        <p className='text-lg font-semibold mb-4'>
                            Links & Documents
                        </p>
                        <div className='space-y-4 mb-4'>
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
                        </div>

                        {['Interview', 'Orientation', 'Hired'].includes(data?.applicantStatus) &&
                            <>
                                <p className='text-lg font-semibold mb-4'>
                                    Interview Information
                                </p>
                                <div className='grid grid-cols-2 gap-4 mb-4'>
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
                                </div>
                            </>
                        }

                        {['Orientation', 'Hired'].includes(data?.applicantStatus) &&
                            <>
                                <p className='text-lg font-semibold mb-4'>
                                    Orientation Information
                                </p>
                                <div className='grid grid-cols-2 gap-4 mb-4'>
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
                                </div>
                            </>
                        }
                    </section>
                )}

                {tab === 2 && (
                    <section className="grow overflow-auto space-y-2">
                        {data?.applicantStatusHistories?.map((d, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="flex flex-col items-center">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                    <div className="bg-gray-300 w-0.5 grow"></div>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{d?.applicantStatus}</p>
                                    <p className="text-sm text-gray-500">{cleanDateTime(d?.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {tab === 3 && (
                    blacklist?.length > 0 &&
                    <section className='grow overflow-auto'>
                        <p className='text-lg font-semibold mb-4'>
                            Backlisted Records
                        </p>
                        <div className='space-y-4'>
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
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}