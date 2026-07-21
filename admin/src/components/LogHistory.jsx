/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronRight, ClipboardClock, Lock, LogIn, LogOut, Power, User, UserRoundPen } from 'lucide-react';
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";
import { useState } from 'react';
import { useEffect } from 'react';
import { fetchAllAdminLog } from '../services/adminServices';
import { cleanDateTime, formatReadableDate } from '../utils/format';
import Pagination from './Pagination';

export default function LogHistory({ onClose = () => { } }) {

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const loadAdminLog = async () => {
        const { success, message, data: apiData, pagination: apiPagination } = await fetchAllAdminLog({ page });

        if (success) {
            setData(apiData);
            setPagination(apiPagination);
        } else {
            console.error(message);
        }
    }

    useEffect(() => {
        loadAdminLog();
    }, [page]);

    return (
        <ModalBackground>
            <Modal>
                <section className='space-y-8'>
                    <ModalHeader
                        title="Log History"
                        onClose={onClose}
                    />

                    {(data.length > 0) ? (
                        <div>
                            <div className='space-y-6'>
                                {data.map((log, index) => {
                                    const datetime = cleanDateTime(log?.createdAt);
                                    const [date, time] = datetime.split(" ");

                                    const prevDate =
                                        index > 0
                                            ? cleanDateTime(data[index - 1]?.createdAt).split(" ")[0]
                                            : null;

                                    const showDate = date !== prevDate;
                                    const isLogin = log.logStatus === 'login';

                                    return (
                                        <div key={index}>
                                            {showDate && (
                                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 first:mt-0 mt-2">
                                                    {formatReadableDate(date)}
                                                </p>
                                            )}

                                            <div className='flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-150'>
                                                <div className='flex items-center gap-3'>
                                                    <div
                                                        className={`flex items-center justify-center w-8 h-8 rounded-full ${isLogin
                                                            ? 'bg-emerald-50 text-emerald-600'
                                                            : 'bg-red-50 text-red-500'
                                                            }`}
                                                    >
                                                        {isLogin ? <LogIn size={15} /> : <LogOut size={15} />}
                                                    </div>
                                                    <span
                                                        className={`text-xs font-semibold tracking-wide ${isLogin ? 'text-emerald-700' : 'text-red-600'
                                                            }`}
                                                    >
                                                        {isLogin ? 'LOGGED IN' : 'LOGGED OUT'}
                                                    </span>
                                                </div>
                                                <p className='text-sm text-gray-500 tabular-nums'>{time}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4">
                                <Pagination
                                    pagination={pagination}
                                    page={page}
                                    setPage={setPage}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            No data
                        </div>
                    )}
                </section>
            </Modal>
        </ModalBackground>
    )
}