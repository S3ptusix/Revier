import { Link, FileText, X, IdCard, Loader2, AlertCircle, ShieldOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cleanDateTime } from '../utils/format';
import { applicantDetails } from '../services/applicantsServices';
import { ModalBackground, Modal, ModalHeader } from './ui/ui-modal';


export default function ApplicantDetails({ applicationId, onClose }) {

    const [tab, setTab] = useState(1);
    const [data, setData] = useState(null);
    const [blacklist, setBlacklist] = useState([]);
    const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setStatus('loading');
            try {
                const { success, message, applicant, blacklist: apiBlacklist } = await applicantDetails(applicationId);
                if (cancelled) return;
                if (success) {
                    setData(applicant);
                    setBlacklist(apiBlacklist || []);
                    setStatus('ready');
                    return;
                }
                console.error(message);
                setStatus('error');
            } catch (error) {
                console.error(error);
                if (!cancelled) setStatus('error');
            }
        };

        load();
        return () => { cancelled = true; };
    }, [applicationId]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const tabs = [
        { id: 1, label: 'Details' },
        { id: 2, label: 'Blacklist' },
    ];

    const field = (value) => value || '—';

    return (
        <ModalBackground>
            <Modal>
                <div className='mb-4'>
                    <ModalHeader
                        title='Application Details'
                        onClose={onClose}
                    />
                </div>

                <div className='flex mb-4' role="tablist">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            role="tab"
                            aria-selected={tab === t.id}
                            className={`btn border-0 rounded-none flex-1 ${tab === t.id ? 'bg-emerald-500 text-white' : ''}`}
                            onClick={() => setTab(t.id)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {status === 'loading' && (
                    <div className='grow flex flex-col items-center justify-center gap-2 text-gray-500'>
                        <Loader2 size={24} className='animate-spin' />
                        <p className='text-sm'>Loading applicant details…</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className='grow flex flex-col items-center justify-center gap-2 text-gray-500'>
                        <AlertCircle size={24} className='text-red-500' />
                        <p className='text-sm'>Couldn't load this applicant's details.</p>
                        <button
                            className='btn bg-emerald-500 text-white rounded-lg text-sm'
                            onClick={() => setTab((t) => t)} // trigger re-render if you wire a retry() instead of relying on effect
                        >
                            Try again
                        </button>
                    </div>
                )}

                {status === 'ready' && tab === 1 && (
                    <section className='grow overflow-auto'>
                        <p className='text-lg font-semibold mb-4'>
                            Basic information
                        </p>
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                            <div>
                                <p className='text-gray-500 text-sm'>Fullname</p>
                                <p className='text-sm'>{field(`${data?.firstName || ''} ${data?.lastName || ''}`.trim())}</p>
                            </div>
                            <div>
                                <p className='text-gray-500 text-sm'>Sex</p>
                                <p className='text-sm'>{field(data?.sex)}</p>
                            </div>
                            <div>
                                <p className='text-gray-500 text-sm'>Email</p>
                                <p className='text-sm'>{field(data?.user?.email)}</p>
                            </div>
                            <div>
                                <p className='text-gray-500 text-sm'>Phone Number</p>
                                <p className='text-sm'>{field(data?.phone)}</p>
                            </div>
                            <div>
                                <p className='text-gray-500 text-sm'>Position Applied</p>
                                <p className='text-sm'>{field(data?.job?.jobTitle)}</p>
                            </div>
                            <div>
                                <p className='text-gray-500 text-sm'>Company</p>
                                <p className='text-sm'>{field(data?.job?.company?.companyName)}</p>
                            </div>
                            <div>
                                <p className='text-gray-500 text-sm'>Application Date</p>
                                <p className='text-sm'>{data?.createdAt ? cleanDateTime(data.createdAt) : '—'}</p>
                            </div>
                        </div>

                        <p className='text-lg font-semibold mb-4'>
                            Links & Documents
                        </p>
                        {!data?.linkedIn && !data?.portfolio && !data?.resume && !data?.validId ? (
                            <p className='text-sm text-gray-500 mb-4'>No links or documents were submitted.</p>
                        ) : (
                            <div className='grid grid-cols-2 gap-4'>
                               
                                {data?.linkedIn &&
                                    <a
                                        href={data.linkedIn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='text-emerald-500 text-sm flex gap-2 border border-emerald-500 rounded-lg p-4 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white transition'
                                    >
                                        <FileText size={18} />
                                        linkedIn
                                    </a>
                                }
                                {data?.portfolio &&
                                    <a
                                        href={data.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='text-emerald-500 text-sm flex gap-2 border border-emerald-500 rounded-lg p-4 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white transition'
                                    >
                                        <FileText size={18} />
                                        Portfolio
                                    </a>
                                }
                                {data?.resume &&
                                    <a
                                        href={data.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='text-emerald-500 text-sm flex gap-2 border border-emerald-500 rounded-lg p-4 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white transition'
                                    >
                                        <FileText size={18} />
                                        Resume
                                    </a>
                                }
                                {data?.validId &&
                                    <a
                                        href={data.validId}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='text-emerald-500 text-sm flex gap-2 border border-emerald-500 rounded-lg p-4 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white transition'
                                    >
                                        <FileText size={18} />
                                        Valid ID
                                    </a>
                                }
                            </div>
                        )}

                        {['Interview', 'Orientation', 'Hired'].includes(data?.applicantStatus) &&
                            <>
                                <p className='text-lg font-semibold mb-4'>
                                    Interview Information
                                </p>
                                <div className='grid grid-cols-2 gap-4 mb-4'>
                                    <div>
                                        <p className='text-gray-500 text-sm'>Interview Date</p>
                                        <p className='text-sm'>{data?.interviewAt ? cleanDateTime(data.interviewAt) : '—'}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-500 text-sm'>Interview Mode</p>
                                        <p className='text-sm'>{field(data?.interviewMode)}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-500 text-sm'>Interview Location</p>
                                        <p className='text-sm'>{field(data?.interviewLocation)}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-500 text-sm'>Interview Status</p>
                                        <p className='text-sm'>{field(data?.interviewStatus)}</p>
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
                                        <p className='text-sm'>{data?.orientationEvent?.eventAt ? cleanDateTime(data.orientationEvent.eventAt) : '—'}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-500 text-sm'>Orientation title</p>
                                        <p className='text-sm'>{field(data?.orientationEvent?.eventTitle)}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-500 text-sm'>Orientation Location</p>
                                        <p className='text-sm'>{field(data?.orientationEvent?.location)}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-500 text-sm'>Status</p>
                                        <p className='text-sm'>{field(data?.orientationStatus)}</p>
                                    </div>
                                </div>
                            </>
                        }
                    </section>
                )}

                {status === 'ready' && tab === 2 && (
                    <section className='grow overflow-auto'>
                        <p className='text-lg font-semibold mb-4'>
                            Blacklisted Records
                        </p>
                        {!blacklist?.length ? (
                            <div className='flex flex-col items-center justify-center text-center gap-2 py-8 text-gray-500'>
                                <ShieldOff size={24} />
                                <p className='text-sm'>This applicant has no blacklist records.</p>
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {blacklist.map((bl, index) => (
                                    <div
                                        key={index}
                                        className='border border-red-200 bg-red-50 p-3 rounded-lg'
                                    >
                                        <p className='text-sm font-bold text-red-700'>{bl?.job?.jobTitle}</p>
                                        <p className='text-sm text-red-600 mb-2'>{bl?.job?.company?.companyName}</p>
                                        <p className='text-sm text-red-500 font-medium'>Reason</p>
                                        <p className='text-sm text-red-700'>
                                            {bl?.blacklistedReason}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </Modal>
        </ModalBackground>
    )
}