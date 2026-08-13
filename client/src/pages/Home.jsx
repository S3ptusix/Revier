import { ArrowRight, MapPin, Search, Shield, Target, Users, Zap } from "lucide-react";
import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";
import professional from '../assets/professional.png';
import casual from '../assets/casual.png';
import recruitment from '../assets/recruitment.png';

export default function Home() {

    const steps = [
        {
            title: "create your profile",
            subTitle: "sign up and build your professional profile to showcase your skills and experience."
        },
        {
            title: "Search & Apply",
            subTitle: "browse jobs based on your interest, location, and expertise—apply in just one click."
        },
        {
            title: "get hired",
            subTitle: "connect with employers, attend interviews, and land your ideal job."
        },
    ]

    return (
        <div className="flex flex-col">
            <TopBar />

            <section className="grid lg:grid-cols-2 gap-16 bg-linear-to-b from-transparent to-emerald-100 px-4 md:px-[10vw] py-20">
                <div className="max-lg:order-2 flex-center">
                    <div className="w-[75%]">
                        <p className="text-4xl font-semibold mb-4">Land the Job You've Been Looking For</p>
                        <p className="text-sm mb-4">Explore tailored opportunities, connect with leading companies, and take the next step in your career with confidence.</p>
                        <Link to="/jobposting">
                            <button className="btn rounded-full bg-emerald-500 text-white shadow-none border-none">
                                Browse Jobs
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="max-lg:justify-center max-lg:order-1 flex gap-4">
                    <div className="mb-12 relative w-fit rounded-3xl overflow-hidden">
                        <div className="rounded-3xl bg-linear-to-b from-emerald-500 to-transparent
                         absolute h-[75%] bottom-0 w-full z-0"
                        />

                        <img
                            src={casual}
                            alt="casual image"
                            className="aspect-3/4 w-[20vw] object-cover relative z-10"
                        />
                    </div>

                    <div className="mt-12 relative w-fit rounded-3xl overflow-hidden">
                        <div className="rounded-3xl bg-linear-to-b from-emerald-500 to-transparent
                         absolute h-[75%] bottom-0 w-full z-0"
                        />

                        <img
                            src={professional}
                            alt="professional image"
                            className="scale-x-[-1] aspect-3/4 w-[20vw] object-cover relative z-10"
                        />
                    </div>
                </div>
            </section>

            <section className="grid lg:grid-cols-2 gap-16 px-4 md:px-[10vw] py-20">
                <div>
                    <p className="text-4xl font-semibold mb-16 capitalize">your future starts with right opportunity</p>
                    <p className="mb-4 font-semibold capitalize">how it works</p>
                    <div className="space-y-4">

                        {steps?.length > 0 ? (
                            steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 bg-gray-100 rounded-xl p-4"
                                >
                                    <div className="flex-center h-10 aspect-square rounded-full bg-gray-400 text-white font-semibold">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-lg capitalize mb-4">
                                            {step?.title}
                                        </p>
                                        <p className="capitalize text-gray-500">
                                            {step?.subTitle}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : null}

                    </div>
                </div>

                <div>
                    <p className="capitalize text-sm mb-4">finding your dream job shouldn't be complicated. that's why our platform is designed to make your job search.</p>
                    <Link to="/register">
                        <button className="btn btn-ghost rounded-full mb-16 bg-emerald-500 text-white">
                            Get Started
                        </button>
                    </Link>

                    <img
                        src={recruitment}
                        alt="recruitment"
                        className="rounded-xl aspect-4/3 object-cover"

                    />

                </div>

            </section>
        </div>
    )
}