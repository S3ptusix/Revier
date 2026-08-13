/* eslint-disable no-unused-vars */
import { useState } from "react";
import Sidemenu from "../components/SideMenu";
import Loading from "../components/Loading";

export default function SystemContent() {

    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="bg-gray-50 grow max-h-screen flex flex-col overflow-auto">
                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="p-8">

                        {/* admin header */}
                        <section className="mb-8">
                            <p className="text-2xl font-semibold">System Content</p>
                            <p className="text-gray-500">Manage system content</p>
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}