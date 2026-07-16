import { ArrowRight, MapPin, Search, Shield, Target, Users, Zap } from "lucide-react";
import Topbar from "../components/Topbar";
import { Link } from "react-router-dom";
import jobSearchImg from '../assets/job-search.png';

export default function Home() {

    const benefits = [
        {
            icon: Zap,
            title: "Quick Apply",
            description: "Apply to multiple job opportunities instantly with a single click using your profile.",
        },
        {
            icon: Shield,
            title: "Verified Companies",
            description: "Browse job listings from trusted, thoroughly verified employers for a safer experience.",
        },
        {
            icon: Target,
            title: "Smart Matching",
            description: "Receive personalized job recommendations tailored to your skills, experience, and preferences.",
        },
        {
            icon: Users,
            title: "Direct Communication",
            description: "Communicate directly with recruiters and hiring managers for faster and clearer interactions.",
        },
    ];

    return (
        <div className="flex flex-col">
            <section className="min-h-screen flex flex-col">
                <Topbar />
                <div className="grow grid md:grid-cols-2 gap-4 px-4 md:px-[10vw] items-center">
                    <div className="max-md:order-2">
                        <p className="text-5xl font-bold mb-6">Land the Job You've Been Looking For</p>
                        <p className="mb-6 text-muted-foreground">
                            Explore tailored opportunities, connect with leading companies, and take the next step in your career with confidence.
                        </p>

                        <Link to="/jobposting" className="inline-block">
                            <button className="btn bg-white text-emerald-600 border border-emerald-500 hover:bg-emerald-50 transition-colors rounded-lg">
                                Browse All Jobs
                                <ArrowRight size={16} className="shrink-0" />
                            </button>
                        </Link>
                    </div>
                    <div className="max-md:order-1 flex items-center justify-center">
                        <img src={jobSearchImg} alt="Illustration of a person searching for a job on a laptop" className="max-md:w-100" />
                    </div>
                </div>
            </section>

            <section className="grid md:grid-cols-2 gap-8 px-4 md:px-[10vw] py-20 items-center">
                <div className="border rounded-lg aspect-video bg-muted flex items-center justify-center text-muted-foreground text-sm">
                    {/* TODO: replace with real photo/illustration before launch */}
                    {/* Team photo placeholder */}
                    <img
                        src="https://scontent.fmnl30-2.fna.fbcdn.net/v/t39.30808-6/497513897_3914694692079479_2413999143619679800_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1363&ctp=s2048x1363&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=cf85f3&_nc_ohc=kyVBdIrkKLQQ7kNvwGTb1aL&_nc_oc=AdpCSiaq-0tmTzfeIdWerhaoPPHO3Sbe8G3OMjRm7sGOg6Hq-7Dvyj9k6pwGQnUbkfo&_nc_zt=23&_nc_ht=scontent.fmnl30-2.fna&_nc_gid=1bxqTYyMvER3uIxOaIu4BA&_nc_ss=7b2a8&oh=00_AQAOO42lU2mu7awamNpxLF92maqfESfcVedZGEJuDjsxiQ&oe=6A5F1D4C"
                        alt=""
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        Who We Are
                    </h2>
                    <p>
                        Revier connects job seekers with employers who are ready to hire — no noise, no dead-end listings.
                        Every company on the platform is verified, every match is built around your actual skills and goals,
                        and every application gets to a real person on the other side.
                    </p>
                </div>
            </section>

            <section className="md:px-[10vw] max-md:px-4 py-20">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Why Choose Revier?
                    </h2>
                    <p className="max-w-2xl text-muted-foreground">
                        From search to hire, Revier gives you everything you need to find your perfect job—faster and smarter.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={benefit.title}
                                className="p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all bg-gray-50"
                            >
                                <div className="w-16 h-16 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                                    <Icon className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="font-medium text-lg mb-2">{benefit.title}</h3>
                                <p className="text-muted-foreground">{benefit.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="md:px-[10vw] max-md:px-4 py-20 bg-emerald-500">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg text-emerald-50 mb-8">
                        Join thousands of job seekers who found their next role with Revier.
                    </p>
                    <div className="flex justify-center flex-wrap gap-4">
                        <Link to="/register">
                            <button className="btn bg-white text-emerald-600 hover:bg-emerald-50 transition-colors rounded-lg">
                                Create Free Account
                            </button>
                        </Link>
                        <Link to="/jobposting">
                            <button className="btn bg-transparent text-white border border-white hover:bg-white/10 transition-colors rounded-lg">
                                Browse Jobs
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}