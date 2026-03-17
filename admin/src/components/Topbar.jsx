import { Bell } from "lucide-react";
import { useContext, useState } from "react";
import { UserContext } from "../context/AuthProvider";
import Profile from "./Profile";

export default function Topbar() {

    const { admin } = useContext(UserContext);

    const [openProfile, setOpenProfile] = useState(false);

    return (
        <>
            <div className="relative flex justify-between items-center border-b border-gray-300 py-4 px-8">
                <button
                    className="btn btn-ghost hover:bg-gray-200"
                    onClick={() => setOpenProfile(true)}
                >
                    <span className="profile-logo h-8 w-8 font-semibold">
                        JC
                    </span>
                    <div className="max-md:hidden">
                        <p className="font-semibold text-sm text-left">{admin?.fullname}</p>
                        <p className="font-semibold text-xs text-gray-500 text-left">{admin?.role}</p>
                    </div>
                </button>

                <button className="relative btn btn-square btn-ghost hover:bg-gray-200">
                    <span className="flex-center absolute bg-emerald-500 text-white h-6 w-6 text-xs rounded-full -top-1/3 -right-1/3">3</span>
                    <Bell size={16} />
                </button>
            </div>
            {openProfile &&
                <Profile onClose={() => setOpenProfile(false)} />
            }
        </>
    )
}