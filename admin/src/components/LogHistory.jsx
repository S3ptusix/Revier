/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronRight, ClipboardClock, Lock, LogIn, LogOut, Power, User, UserRoundPen } from 'lucide-react';
import { Modal, ModalBackground, ModalBody, ModalFooter, ModalHeader } from "./ui/ui-modal";
import { useState } from 'react';
import { useEffect } from 'react';
import { fetchAllAdminLog } from '../services/adminServices';
import { formatToLocal, formatReadableDate, toStandardTimeFull } from '../utils/format';
import Pagination from './Pagination';
import NoData from './ui/NoData';

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
                <ModalHeader
                    title="Log History"
                    onClose={onClose}
                />

                <ModalBody>
                    {(data.length > 0) ? (
                        <>
                            {data.map((log, index) => {
                                const datetime = formatToLocal(log?.createdAt);
                                console.log({ datetime, createdAt: log?.createdAt });
                                const [date, time] = datetime.split(" ");

                                const prevDate =
                                    index > 0
                                        ? formatToLocal(data[index - 1]?.createdAt).split(" ")[0]
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
                                            <p className='text-sm text-gray-500 tabular-nums'>{toStandardTimeFull(time)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            <Pagination
                                pagination={pagination}
                                page={page}
                                setPage={setPage}
                            />
                        </>
                    ) : (
                        <NoData />
                    )}
                </ModalBody>
            </Modal>
        </ModalBackground>
    )
}