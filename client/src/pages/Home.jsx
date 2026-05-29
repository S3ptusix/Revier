import { ArrowRight, DivideSquare, MapPin, Search, Shield, Target, TrendingUp, Users, Zap } from "lucide-react";
import Topbar from "../components/Topbar";
import { Link } from "react-router-dom";
import Card from "../components/Card";
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
                <div className="grow grid md:grid-cols-2 gap-4 px-4 md:px-[10vw]">
                    <div className="max-md:order-2 flex items-center justify-center">
                        <div>
                            <p className="text-5xl font-bold mb-6"> Land the Job You’ve Been Looking For </p> 
                            <p className="mb-6"> Explore tailored opportunities, connect with leading companies, and take the next step in your career with confidence. </p>
                            <Link to="/jobposting">
                                <button className="btn bg-emerald-500 text-white rounded-lg">
                                    Find Jobs
                                    <ArrowRight size={16} className="shrink-0" />
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="max-md:order-1 flex items-center justify-center">
                        <img src={jobSearchImg} alt="Job Search" className="max-md:w-100" />
                    </div>
                </div>
            </section>

            <section className="grid md:grid-cols-2 gap-4 px-4 md:px-[10vw] py-20">
                <div className="border">
                    IMAGE
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        How We Are?
                    </h2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit eligendi vero totam architecto minus aliquid porro possimus excepturi repellendus culpa magnam ut, distinctio molestiae id laudantium pariatur dicta dolore maiores nesciunt? Officia, nihil a aperiam culpa sint eum libero excepturi amet maxime illum voluptatibus vero numquam, iure provident, autem laudantium!
                    </p>
                </div>
            </section>

            <section className=" md:px-[10vw] max-md:px-4 py-20">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        Why Choose Revier?
                    </h2>
                    <p className="max-w-2xl">
                        From search to hire, Revier gives you everything you need to find your perfect job—faster and smarter.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                            <div key={benefit.title} className="p-4 rounded-lg shadow">
                                <div className="w-16 h-16 rounded-lg bg-white/25 flex items-center justify-center mb-4">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-medium text-lg mb-2">{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* <section className="md:px-[10vw] max-md:px-4 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Join thousands of job seekers who found their dream job with Revier
                    </p>
                    <div className="flex justify-center flex-wrap gap-4">
                        <Link to="/register">
                            <button className="btn bg-emerald-500 text-white rounded-lg">
                                Create Free Account
                            </button>
                        </Link>
                        <Link to="/jobposting">
                            <button className="btn bg-white text-emerald-500 border border-emerald-500 rounded-lg">
                                Browse Jobs
                            </button>
                        </Link>
                    </div>
                </div>
            </section> */}
        </div>
    )
}