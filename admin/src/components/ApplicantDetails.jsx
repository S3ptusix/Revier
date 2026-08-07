/* eslint-disable no-unused-vars */
import {
    FileText,
    Loader2,
    AlertCircle,
    ShieldOff,
    CheckCircle2,
    Circle,
    XCircle,
    UserCheck2,
    Ban,
    CalendarClock,
    ThumbsUp,
    ThumbsDown,
    UserCheck,
    UserX,
    Zap,
    Link2,
    ExternalLink,
    Globe,
    IdCard,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatShortDateTime } from '../utils/format';
import { applicantDetails } from '../services/applicantServices';
import { ModalBackground, Modal, ModalHeader, ModalBody } from './ui/ui-modal';

// Status pill colors, reused for the header badge and section styling.
const STATUS_STYLES = {
    New: 'bg-blue-100 text-blue-700',
    Interview: 'bg-amber-100 text-amber-700',
    Orientation: 'bg-purple-100 text-purple-700',
    Hired: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700',
};

export default function ApplicantDetails({
    applicantId,
    onClose,
}) {

    const [tab, setTab] = useState(1);
    const [data, setData] = useState(null);
    const [blacklist, setBlacklist] = useState([]);
    const [trackApplication, setTrackApplication] = useState(null);
    const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
    const [showReason, setShowReason] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setStatus('loading');
            try {
                const {
                    success,
                    message,
                    applicant,
                    trackApplication: apiTrackApplication,
                    blacklist: apiBlacklist

                } = await applicantDetails(applicantId);

                if (cancelled) return;
                if (success) {
                    setData(applicant);
                    setBlacklist(apiBlacklist || []);
                    setTrackApplication(apiTrackApplication || {});
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
    }, [applicantId]);

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
        { id: 3, label: 'Timeline' },
        { id: 4, label: 'Actions' },
    ];

    const field = (value) => value || '—';

    // Steps in order. Each maps to a key on trackApplication and a display label.
    const trackSteps = [
        { key: 'appliedAt', label: 'Applied' },
        { key: 'interviewedAt', label: 'Interview' },
        { key: 'orientedAt', label: 'Orientation' },
        { key: 'hiredAt', label: 'Hired' },
    ];

    const isRejected = !!trackApplication?.rejectedAt;

    // Index of the last completed step (based on filled dates, in order).
    const lastCompletedIndex = trackSteps.reduce((acc, step, idx) => {
        return trackApplication?.[step.key] ? idx : acc;
    }, -1);

    // Action buttons per applicant status. `blacklist` is appended separately
    // below since it applies to almost every status.
    const statusActions = {
        New: [
            { label: 'For Interview', icon: UserCheck2, className: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
            { label: 'Reject', icon: Ban, className: 'bg-red-500 hover:bg-red-600 text-white' },
        ],
        Interview: [
            { label: 'Reschedule Interview', icon: CalendarClock, className: 'bg-amber-500 hover:bg-amber-600 text-white' },
            { label: 'Passed Interview', icon: ThumbsUp, className: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
            { label: 'Failed Interview', icon: ThumbsDown, className: 'bg-red-500 hover:bg-red-600 text-white' },
        ],
        Orientation: [
            { label: 'Change Event', icon: CalendarClock, className: 'bg-amber-500 hover:bg-amber-600 text-white' },
            { label: 'Present', icon: UserCheck, className: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
            { label: 'Absent', icon: UserX, className: 'bg-red-500 hover:bg-red-600 text-white' },
        ],
        Hired: [],
        Rejected: [],
    };

    const showBlacklistAction = ['New', 'Interview', 'Orientation', 'Hired', 'Rejected'].includes(data?.applicantStatus);
    const currentActions = statusActions[data?.applicantStatus] || [];

    const toExternalUrl = (url) => {
        if (!url) return null;
        return /^https?:\/\//i.test(url) ? url : `https://${url}`;
    };

    return (
        <ModalBackground>
            <Modal>
                <ModalHeader
                    title='Application Details'
                    onClose={onClose}
                />

                <ModalBody>

                    {status === 'ready' && data?.applicantStatus && (
                        <div className='flex items-center gap-2 mb-4'>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[data.applicantStatus] || 'bg-gray-100 text-gray-600'}`}>
                                {data.applicantStatus}
                            </span>
                            <span className='text-sm text-gray-500'>
                                {field(`${data?.firstName || ''} ${data?.lastName || ''}`.trim())} · {field(data?.job?.jobTitle)}
                            </span>
                        </div>
                    )}

                    <div className='flex mb-4 bg-gray-100 rounded-lg p-1 gap-1' role="tablist">
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                role="tab"
                                aria-selected={tab === t.id}
                                className={`flex-1 btn btn-ghost ${tab === t.id ? 'text-gray-900 shadow-sm bg-white' : 'text-gray-400 hover:text-gray-600'}`}
                                onClick={() => setTab(t.id)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {status === 'loading' && (
                        <div className='grow flex flex-col items-center justify-center gap-2 text-gray-500 py-12'>
                            <Loader2 size={24} className='animate-spin' />
                            <p className='text-sm'>Loading applicant details…</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className='grow flex flex-col items-center justify-center gap-2 text-gray-500 py-12'>
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
                            <p className='text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3'>
                                Basic information
                            </p>
                            <div className='grid grid-cols-2 gap-4 mb-6 bg-gray-50 rounded-xl p-4'>
                                <div>
                                    <p className='text-gray-400 text-xs mb-0.5'>Fullname</p>
                                    <p className='text-sm font-medium text-gray-900'>{field(`${data?.firstName || ''} ${data?.lastName || ''}`.trim())}</p>
                                </div>
                                <div>
                                    <p className='text-gray-400 text-xs mb-0.5'>Sex</p>
                                    <p className='text-sm font-medium text-gray-900'>{field(data?.sex)}</p>
                                </div>
                                <div>
                                    <p className='text-gray-400 text-xs mb-0.5'>Email</p>
                                    <p className='text-sm font-medium text-gray-900'>{field(data?.user?.email)}</p>
                                </div>
                                <div>
                                    <p className='text-gray-400 text-xs mb-0.5'>Phone Number</p>
                                    <p className='text-sm font-medium text-gray-900'>{field(data?.phone)}</p>
                                </div>
                                <div>
                                    <p className='text-gray-400 text-xs mb-0.5'>Position Applied</p>
                                    <p className='text-sm font-medium text-gray-900'>{field(data?.job?.jobTitle)}</p>
                                </div>
                                <div>
                                    <p className='text-gray-400 text-xs mb-0.5'>Company</p>
                                    <p className='text-sm font-medium text-gray-900'>{field(data?.job?.company?.companyName)}</p>
                                </div>
                                <div>
                                    <p className='text-gray-400 text-xs mb-0.5'>Application Date</p>
                                    <p className='text-sm font-medium text-gray-900'>{data?.createdAt ? formatShortDateTime(data.createdAt) : '—'}</p>
                                </div>
                            </div>

                            <p className='text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3'>
                                Links & Documents
                            </p>
                            {!data?.linkedIn && !data?.portfolio && !data?.resume && !data?.validId ? (
                                <p className='text-sm text-gray-400 mb-6'>No links or documents were submitted.</p>
                            ) : (
                                <div className='grid grid-cols-2 gap-3 mb-6'>

                                    {data?.linkedIn &&
                                        <a
                                            href={toExternalUrl(data.linkedIn)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='group flex items-center gap-3 rounded-lg border border-gray-200 hover:border-blue-300 bg-white px-4 py-3 shadow-sm hover:shadow-md active:scale-[0.98]'
                                        >
                                            <span className='flex items-center justify-center w-9 h-9 rounded-full shrink-0 bg-blue-50 group-hover:bg-blue-100'>
                                                <Link2 size={16} className='text-blue-600' />
                                            </span>
                                            <span className='text-sm font-semibold text-gray-900 flex-1'>
                                                LinkedIn
                                            </span>
                                            <ExternalLink size={14} className='text-gray-300 group-hover:text-blue-400 shrink-0' />
                                        </a>
                                    }
                                    {data?.portfolio &&
                                        <a
                                            href={toExternalUrl(data.portfolio)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='group flex items-center gap-3 rounded-lg border border-gray-200 hover:border-blue-300 bg-white px-4 py-3 shadow-sm hover:shadow-md active:scale-[0.98]'
                                        >
                                            <span className='flex items-center justify-center w-9 h-9 rounded-full shrink-0 bg-blue-50 group-hover:bg-blue-100'>
                                                <Globe size={16} className='text-blue-600' />
                                            </span>
                                            <span className='text-sm font-semibold text-gray-900 flex-1'>
                                                Portfolio
                                            </span>
                                            <ExternalLink size={14} className='text-gray-300 group-hover:text-blue-400 shrink-0' />
                                        </a>
                                    }
                                    {data?.resume &&
                                        <a
                                            href={data.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='group flex items-center gap-3 rounded-lg border border-gray-200 hover:border-blue-300 bg-white px-4 py-3 shadow-sm hover:shadow-md active:scale-[0.98]'
                                        >
                                            <span className='flex items-center justify-center w-9 h-9 rounded-full shrink-0 bg-blue-50 group-hover:bg-blue-100'>
                                                <FileText size={16} className='text-blue-600' />
                                            </span>
                                            <span className='text-sm font-semibold text-gray-900 flex-1'>
                                                Resume
                                            </span>
                                            <ExternalLink size={14} className='text-gray-300 group-hover:text-blue-400 shrink-0' />
                                        </a>
                                    }
                                    {data?.validId &&
                                        <a
                                            href={data.validId}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='group flex items-center gap-3 rounded-lg border border-gray-200 hover:border-blue-300 bg-white px-4 py-3 shadow-sm hover:shadow-md active:scale-[0.98]'
                                        >
                                            <span className='flex items-center justify-center w-9 h-9 rounded-full shrink-0 bg-blue-50 group-hover:bg-blue-100'>
                                                <IdCard size={16} className='text-blue-600' />
                                            </span>
                                            <span className='text-sm font-semibold text-gray-900 flex-1'>
                                                Valid ID
                                            </span>
                                            <ExternalLink size={14} className='text-gray-300 group-hover:text-blue-400 shrink-0' />
                                        </a>
                                    }
                                </div>
                            )}

                            {['Interview', 'Orientation', 'Hired'].includes(data?.applicantStatus) &&
                                <>
                                    <p className='text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3'>
                                        Interview Information
                                    </p>
                                    <div className='grid grid-cols-2 gap-4 mb-6 bg-gray-50 rounded-xl p-4'>
                                        <div>
                                            <p className='text-gray-400 text-xs mb-0.5'>Interview Date</p>
                                            <p className='text-sm font-medium text-gray-900'>{data?.interviewAt ? formatShortDateTime(data.interviewAt) : '—'}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-400 text-xs mb-0.5'>Interview Mode</p>
                                            <p className='text-sm font-medium text-gray-900'>{field(data?.interviewMode)}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-400 text-xs mb-0.5'>Interview Location</p>
                                            <p className='text-sm font-medium text-gray-900'>{field(data?.interviewLocation)}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-400 text-xs mb-0.5'>Interview Status</p>
                                            <p className='text-sm font-medium text-gray-900'>{field(data?.interviewStatus)}</p>
                                        </div>
                                    </div>
                                </>
                            }

                            {['Orientation', 'Hired'].includes(data?.applicantStatus) &&
                                <>
                                    <p className='text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3'>
                                        Orientation Information
                                    </p>
                                    <div className='grid grid-cols-2 gap-4 mb-4 bg-gray-50 rounded-xl p-4'>
                                        <div>
                                            <p className='text-gray-400 text-xs mb-0.5'>Orientation Date</p>
                                            <p className='text-sm font-medium text-gray-900'>{data?.orientationEvent?.eventAt ? formatShortDateTime(data.orientationEvent.eventAt) : '—'}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-400 text-xs mb-0.5'>Orientation title</p>
                                            <p className='text-sm font-medium text-gray-900'>{field(data?.orientationEvent?.eventTitle)}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-400 text-xs mb-0.5'>Orientation Location</p>
                                            <p className='text-sm font-medium text-gray-900'>{field(data?.orientationEvent?.location)}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-400 text-xs mb-0.5'>Status</p>
                                            <p className='text-sm font-medium text-gray-900'>{field(data?.orientationStatus)}</p>
                                        </div>
                                    </div>
                                </>
                            }
                        </section>
                    )}

                    {status === 'ready' && tab === 2 && (
                        <section className='grow overflow-auto'>
                            <p className='text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3'>
                                Blacklisted Records
                            </p>
                            {!blacklist?.length ? (
                                <div className='flex flex-col items-center justify-center text-center gap-2 py-12 text-gray-400'>
                                    <ShieldOff size={28} />
                                    <p className='text-sm'>This applicant has no blacklist records.</p>
                                </div>
                            ) : (
                                <div className='space-y-3'>
                                    {blacklist.map((bl, index) => (
                                        <div
                                            key={index}
                                            className='flex gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'
                                        >
                                            <span className='flex items-center justify-center w-9 h-9 rounded-full shrink-0 bg-gray-900'>
                                                <Ban size={16} className='text-white' />
                                            </span>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-start justify-between gap-2 mb-2'>
                                                    <div className='min-w-0'>
                                                        <p className='text-sm font-semibold text-gray-900 truncate'>{field(bl?.job?.jobTitle)}</p>
                                                        <p className='text-xs text-gray-500 truncate'>{field(bl?.job?.company?.companyName)}</p>
                                                    </div>
                                                    <span className='text-[10px] font-semibold text-white bg-gray-900 rounded-full px-2 py-0.5 shrink-0'>
                                                        Blacklisted
                                                    </span>
                                                </div>
                                                <p className='text-xs'>{formatShortDateTime(field(bl?.blacklistedAt))}</p>
                                                <div className='bg-gray-50 border border-gray-200 rounded-lg px-3 py-2'>
                                                    <p className='text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-0.5'>Reason</p>
                                                    <p className='text-sm text-gray-700 leading-snug'>
                                                        {field(bl?.blacklistedReasonNote)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {status === 'ready' && tab === 3 && (
                        <section className='grow overflow-auto'>
                            <p className='text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4'>
                                Application Progress
                            </p>

                            {isRejected && (
                                <div className='flex items-center gap-3 border border-red-200 bg-red-50 p-3 rounded-xl mb-4'>
                                    <XCircle size={18} className='text-red-500 shrink-0' />
                                    <div className='flex-1'>
                                        <div className='flex items-center justify-between gap-2'>
                                            <p className='text-sm font-bold text-red-700'>Rejected</p>
                                            <button
                                                type='button'
                                                onClick={() => setShowReason((prev) => !prev)}
                                                className='text-xs font-medium text-red-600 hover:text-red-700 underline underline-offset-2 shrink-0'
                                            >
                                                {showReason ? 'Hide reason' : 'Show reason'}
                                            </button>
                                        </div>

                                        {showReason && (
                                            <div className='mt-2 mb-3 rounded-lg bg-red-100/60 px-3 py-2'>
                                                <p className='text-[10px] font-semibold text-red-600 uppercase tracking-wide mb-1'>
                                                    Reason
                                                </p>
                                                <p className='text-sm text-red-700 leading-relaxed'>
                                                    {trackApplication.rejectedReasonNote || 'No reason provided.'}
                                                </p>
                                            </div>
                                        )}

                                        <p className='text-sm text-red-600'>
                                            {formatShortDateTime(trackApplication.rejectedAt)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                {trackSteps.map((step, idx) => {
                                    const dateValue = trackApplication?.[step.key];
                                    const isCompleted = !!dateValue;
                                    // A step is "current/pending" only if it's the next one after the
                                    // last completed step, and the applicant wasn't rejected.
                                    const isNext = !isRejected && !isCompleted && idx === lastCompletedIndex + 1;
                                    const isLast = idx === trackSteps.length - 1;

                                    return (
                                        <div key={step.key} className='flex gap-3'>
                                            <div className='flex flex-col items-center'>
                                                {isCompleted ? (
                                                    <CheckCircle2 size={22} className='text-emerald-500 shrink-0' />
                                                ) : (
                                                    <Circle
                                                        size={22}
                                                        className={`shrink-0 ${isNext ? 'text-emerald-500' : 'text-gray-300'}`}
                                                    />
                                                )}
                                                {!isLast && (
                                                    <div
                                                        className={`w-px flex-1 min-h-6 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                                    />
                                                )}
                                            </div>
                                            <div className='pb-6'>
                                                <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {step.label}
                                                </p>
                                                <p className={`text-sm ${isCompleted ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    {isCompleted ? formatShortDateTime(dateValue) : (isNext ? 'Pending' : '—')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {status === 'ready' && tab === 4 && (
                        <section className='grow overflow-auto'>
                            <p className='text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4'>
                                Available Actions
                            </p>

                            {(currentActions.length === 0 || data?.isRejected === true) && (
                                <div className='flex flex-col items-center justify-center text-center gap-2 py-12 text-gray-400'>
                                    <Zap size={28} />
                                    <p className='text-sm'>No actions available for this applicant's status.</p>
                                </div>
                            )}

                            {(currentActions.length > 0 && data?.isRejected === false) && (
                                <div className='grid grid-cols-1 gap-2 mb-6'>
                                    {currentActions.map(({ label, icon: Icon }) => (
                                        <button
                                            key={label}
                                            type='button'
                                            className='cursor-pointer group flex items-center gap-3 rounded-lg border border-gray-200 hover:border-gray-300 bg-white px-4 py-3 text-left shadow-sm hover:shadow-md active:scale-[0.98]'
                                        >
                                            <span className='flex items-center justify-center w-9 h-9 rounded-full shrink-0 bg-gray-100 group-hover:bg-gray-200'>
                                                <Icon size={16} className='text-gray-600' />
                                            </span>
                                            <span className='text-sm font-semibold text-gray-900'>
                                                {label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {showBlacklistAction && (
                                <>
                                    <p className='text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3'>
                                        Other
                                    </p>
                                    <button
                                        type='button'
                                        className='cursor-pointer group flex items-center gap-3 rounded-lg border border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 px-4 py-3 text-left shadow-sm hover:shadow-md active:scale-[0.98] w-full'
                                    >
                                        <span className='flex items-center justify-center w-9 h-9 rounded-full shrink-0 bg-gray-900 group-hover:bg-black'>
                                            <Ban size={16} className='text-white' />
                                        </span>
                                        <span className='text-sm font-semibold text-gray-900'>
                                            Blacklist Applicant
                                        </span>
                                    </button>
                                </>
                            )}
                        </section>
                    )}

                </ModalBody>

            </Modal>
        </ModalBackground>
    )
}