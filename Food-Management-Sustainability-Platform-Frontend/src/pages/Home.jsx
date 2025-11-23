
/* eslint-disable-next-line no-unused-vars */
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Zap, Target, Users, Menu, X } from "lucide-react";
import { Link } from "react-router";

// Internal Button Component
const Button = ({
    children,
    size = "md",
    variant = "primary",
    className = "",
    ...props
}) => {
    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    const variantClasses = {
        primary: "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg",
        outline: "border-2 border-green-600 text-green-600 hover:bg-green-50",
        secondary: "bg-white text-green-600 hover:bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md",
    };

    return (
        <button
            className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// Internal Card Component
const Card = ({ children, hoverable = false, className = "" }) => {
    return (
        <div
            className={`p-6 rounded-xl bg-white border border-gray-200 shadow-sm h-full ${hoverable ? "hover:shadow-lg hover:border-green-300 hover:-translate-y-1 transition-all duration-300" : ""
                } ${className}`}
        >
            {children}
        </div>
    );
};

const Home = () => {
    

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const features = [
        {
            icon: <Leaf className="w-8 h-8" />,
            title: "Smart Food Management",
            description:
                "AI-powered inventory tracking and expiration date management to reduce food waste effectively.",
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Real-time Analytics",
            description:
                "Track consumption patterns and get actionable insights for sustainable living every day.",
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Sustainability Goals",
            description:
                "Align with SDG 2 (Zero Hunger) and SDG 12 (Responsible Consumption & Production).",
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Community Impact",
            description:
                "Share surplus food and contribute to a sustainable food ecosystem in your local area.",
        },
    ];

    const steps = [
        { number: 1, title: "Track", description: "Log your food items and consumption" },
        { number: 2, title: "Analyze", description: "Get insights on waste and patterns" },
        { number: 3, title: "Optimize", description: "Receive personalized recommendations" },
        { number: 4, title: "Impact", description: "See your sustainability footprint" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-emerald-50 text-gray-800 overflow-x-hidden">


            {/* Hero Section */}
            <motion.section
                className="max-w-7xl mx-auto px-6 py-16 md:py-32"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-20">
                    {/* Text Content */}
                    <motion.div variants={itemVariants} className="order-2 md:order-1">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-green-100 border border-green-200 shadow-sm"
                        >

                            <span className="text-sm font-semibold text-green-700">
                                Powered by AI for Sustainability
                            </span>
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                            Smart Food Management for a{" "}
                            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                                Sustainable Future
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                            FreshFlow helps you reduce food waste, track consumption, and make smarter
                            decisions. Join thousands reducing their environmental footprint while saving
                            money.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register">
                                <Button size="lg" className="w-full sm:w-auto shadow-green-200 hover:shadow-green-300">
                                    Start Free Trial <ArrowRight size={20} />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                View Demo
                            </Button>
                        </div>

                        <div className="flex items-center gap-6 mt-8 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                No credit card required
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                Takes 2 minutes to setup
                            </div>
                        </div>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div
                        variants={itemVariants}
                        className="relative order-1 md:order-2"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-[2rem] opacity-20 blur-3xl transform rotate-3 scale-95" />
                        <Card className="relative border border-white/50 shadow-2xl overflow-hidden !bg-white/80 backdrop-blur-sm !p-0 rounded-[2rem]">
                            <div className="aspect-square md:aspect-[4/3] bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-8">
                                <div className="text-center space-y-6 relative z-10">
                                    <motion.div
                                        animate={{
                                            y: [0, -10, 0],
                                            boxShadow: ["0px 10px 20px rgba(0,0,0,0.1)", "0px 20px 40px rgba(16, 185, 129, 0.2)", "0px 10px 20px rgba(0,0,0,0.1)"]
                                        }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-400 mx-auto flex items-center justify-center text-white shadow-xl"
                                    >
                                        <Leaf size={64} strokeWidth={1.5} />
                                    </motion.div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 mb-2">
                                            Smart Tracking
                                        </p>
                                        <p className="text-gray-500 font-medium">
                                            Real-time insights & analytics
                                        </p>
                                    </div>

                                    <div className="flex justify-center gap-2 mt-4">
                                        <div className="h-2 w-2 rounded-full bg-green-500 opacity-50"></div>
                                        <div className="h-2 w-2 rounded-full bg-green-500 opacity-50"></div>
                                        <div className="h-2 w-8 rounded-full bg-green-500"></div>
                                        <div className="h-2 w-2 rounded-full bg-green-500 opacity-50"></div>
                                    </div>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </motion.section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

                <motion.div
                    className="max-w-7xl mx-auto px-6 relative z-10"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div variants={itemVariants} className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                            Powerful Features for <br />
                            <span className="text-green-600">Food Sustainability</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Everything you need to manage food efficiently, reduce waste, and save money while helping the planet.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <Card hoverable className="h-full border-gray-100 bg-gray-50/50">
                                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-white shadow-md text-green-600 border border-green-100">
                                                {feature.icon}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* How It Works Section */}
            <motion.section
                id="how-it-works"
                className="max-w-7xl mx-auto px-6 py-24"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <motion.div variants={itemVariants} className="text-center mb-20">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-xl text-gray-600">
                        Start your sustainable journey in 4 simple steps
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {steps.map((step, index) => (
                        <motion.div key={index} variants={itemVariants} className="relative group">
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-200 to-transparent z-0" />
                            )}
                            <div className="relative z-10 text-center">
                                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-green-100 text-green-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:border-green-500 group-hover:text-green-700">
                                    {step.number}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* SDG Goals Section */}
            <motion.section
                className="bg-gray-900 text-white py-24 relative overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-500 rounded-full blur-[100px]"></div>
                    <div className="absolute top-1/2 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[80px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Aligned with Global Sustainability Goals
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            We are committed to contributing to the United Nations Sustainable Development Goals.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div variants={itemVariants}>
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl hover:bg-gray-800 transition-colors h-full">
                                <div className="flex gap-6 items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-[#D4A029] text-white font-bold text-2xl shadow-lg">
                                            2
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-3 text-[#D4A029]">
                                            Zero Hunger
                                        </h3>
                                        <p className="text-gray-300 text-lg leading-relaxed">
                                            We aim to reduce food waste ensuring efficient food utilization, contributing to better nutrition and food security for everyone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl hover:bg-gray-800 transition-colors h-full">
                                <div className="flex gap-6 items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-[#BF8B2E] text-white font-bold text-2xl shadow-lg">
                                            12
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-3 text-[#BF8B2E]">
                                            Responsible Consumption
                                        </h3>
                                        <p className="text-gray-300 text-lg leading-relaxed">
                                            By tracking and optimizing consumption patterns, we promote sustainable production and consumption habits across communities.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                className="max-w-5xl mx-auto px-6 py-24"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <Card className="!bg-gradient-to-r from-green-600 to-emerald-600 border-0 text-white text-center p-12 md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Make an Impact?</h2>
                        <p className="text-lg md:text-xl text-green-50 mb-10 max-w-2xl mx-auto">
                            Join thousands of users reducing food waste and building a sustainable future today.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/register">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="font-bold text-green-700 hover:bg-green-50"
                                >
                                    Get Started Free <ArrowRight size={20} />
                                </Button>
                            </Link>

                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white/10"
                            >
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.section>

            {/* Footer */}

        </div>
    );
};

export default Home;