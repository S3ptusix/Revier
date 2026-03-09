import { ArrowRight, MapPin, Search, Shield, Target, TrendingUp, Users, Zap } from "lucide-react";
import Topbar from "../components/Topbar";
import { Link } from "react-router-dom";
import Card from "../components/Card";

export default function Home() {

    const benefits = [
        {
            icon: Zap,
            title: "Quick Apply",
            description: "Apply to multiple jobs with one click using your profile",
        },
        {
            icon: Shield,
            title: "Verified Companies",
            description: "All employers are verified to ensure legitimacy and quality",
        },
        {
            icon: Target,
            title: "Smart Matching",
            description: "Get matched with jobs that fit your skills and preferences",
        },
        {
            icon: Users,
            title: "Direct Communication",
            description: "Connect directly with hiring managers and recruiters",
        },
    ];

    const newJobHiring = [
        {
            id: 1,
            jobTitle: 'UX Researcher',
            company: {
                companyName: 'Innovation Co',
                location: 'Carmona, Cavite'
            },
            type: 'Contact',
            postedAt: '1d ago'
        },
        {
            id: 2,
            jobTitle: 'Software Developer',
            company: {
                companyName: 'Nissan Sta.Rosa',
                location: 'Sta.Rosa, Laguna',
            },
            type: 'Internship',
            postedAt: '3d ago'
        },
        {
            id: 3,
            jobTitle: 'Frontend Developer',
            company: {
                companyName: 'TechNova Solutions',
                location: 'Makati City'
            },
            type: 'Full-time',
            postedAt: '2d ago'
        },
        {
            id: 4,
            jobTitle: 'UI/UX Designer',
            company: {
                companyName: 'PixelCraft Studio',
                location: 'Quezon City'
            },
            type: 'Contract',
            postedAt: '5d ago'
        },
        {
            id: 5,
            jobTitle: 'Backend Developer',
            company: {
                companyName: 'CloudWorks PH',
                location: 'Taguig City'
            },
            type: 'Full-time',
            postedAt: '1w ago'
        },
        {
            id: 6,
            jobTitle: 'QA Tester',
            company: {
                companyName: 'NextGen Software',
                location: 'Cebu City'
            },
            type: 'Internship',
            postedAt: '4d ago'
        }
    ]

    return (
        <div className="flex flex-col max-h-screen">
            <Topbar />
            <div className="grow overflow-auto">
                <section className="flex gap-6 py-20 px-[10vw] bg-emerald-500">
                    <div className="flex-1 flex flex-col justify-center">
                        <p className="text-white text-5xl font-bold mb-6">Find Your Dream Job Today</p>
                        <p className="text-white text-lg mb-6">
                            Connect with top companies and discover opportunities that match your skills. Your next career move starts here.
                        </p>

                        <div className="bg-white p-2 rounded-2xl">
                            <div className="flex items-center px-2 mb-2">
                                <Search className="text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Job Title, Keywords..."
                                    className="w-full px-4 py-2 outline-0"
                                />
                            </div>
                            <div className="flex items-center px-2 mb-2">
                                <MapPin className="text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="City or remote"
                                    className="w-full px-4 py-2 outline-0"
                                />
                            </div>
                            <button className="py-6 btn bg-emerald-500 text-white w-full rounded-lg">
                                Search Jobs
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 max-lg:hidden">
                        <img
                            src="https://images.unsplash.com/photo-1743865318581-2e0e59e7292e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGxhcHRvcHxlbnwxfHx8fDE3NzAyNjQ1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                            alt="Professional working"
                            className="h-full rounded-2xl object-cover shadow-lg"
                        />
                    </div>
                </section>

                <section className="px-[10vw] py-20">
                    <div className="flex justify-between align-center mb-8">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="text-emerald-500" />
                            <p className="text-2xl font-bold">New Job Hiring</p>
                        </div>

                        <Link to={'/jobposting'}>
                            <button className="flex items-center gap-2 text-emerald-500 cursor-pointer">
                                View all jobs
                                <ArrowRight size={16} />
                            </button>
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {newJobHiring.length > 0 ? (
                            newJobHiring.map(job => (
                                <Card key={job.id} job={job} />
                            ))
                        ) : (
                            <p>No new job hiring</p>
                        )}
                    </div>
                </section>

                <section className="px-[10vw] py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                                Why Choose Revier?
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Everything you need to find your perfect job in one place
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {benefits.map((benefit) => {
                                const Icon = benefit.icon;
                                return (
                                    <div key={benefit.title} className="text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                            <Icon className="w-8 h-8 text-emerald-500" />
                                        </div>
                                        <h3 className="font-medium text-foreground mb-2">{benefit.title}</h3>
                                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="px-[10vw] py-20">
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
                                <button className="btn rounded-lg">
                                    Browse Jobs
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}