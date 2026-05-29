/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronRight, ClipboardClock, Lock, LogOut, Power, User, UserRoundPen } from 'lucide-react';
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";
import { useState } from 'react';
import { useEffect } from 'react';
import { fetchAllAdminLog } from '../services/adminServices';
import { cleanDateTime } from '../utils/format';
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
                            <div className='space-y-1'>
                                {data.map((log, index) => {
                                    const datetime = cleanDateTime(log?.createdAt);
                                    const [date, time] = datetime.split(" ");

                                    const prevDate =
                                        index > 0
                                            ? cleanDateTime(data[index - 1]?.createdAt).split(" ")[0]
                                            : null;

                                    const showDate = date !== prevDate;

                                    return (
                                        <div key={index}>
                                            {showDate && (
                                                <p className="text-xs mt-4 mb-1">
                                                    {date}
                                                </p>
                                            )}

                                            <div className='flex items-center justify-between bg-gray-100 rounded-lg p-4'>
                                                {log.logStatus === 'login' ? (
                                                    <div className='flex gap-1 text-sm'>
                                                        <div className='p-1 w-fit rounded-full bg-emerald-500 text-white'>
                                                            <Power size={16} />
                                                        </div>
                                                        LOGIN
                                                    </div>
                                                ) : (
                                                    <div className='flex gap-1 text-sm'>
                                                        <div className='p-1 w-fit rounded-full bg-red-500 text-white'>
                                                            <Power size={16} />
                                                        </div>
                                                        LOGOUT
                                                    </div>
                                                )}
                                                <p className='text-sm'>{time}</p>
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