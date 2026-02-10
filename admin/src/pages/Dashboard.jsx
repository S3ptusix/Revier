import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";

export default function Dashboard() {

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 overflow-auto">
                    Dashboard
                </div>
            </div>
        </div>
    )
}