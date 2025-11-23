import { Outlet } from "react-router";
import Navbar from "../components/ui/layout/Navbar";
import Footer from "../components/ui/layout/Footer";
import NourishBot from "../components/ai/NourishBot";

const MainLayout = () => {
    return (
        <div className="relative min-h-screen">
            {/* navbar */}
            <Navbar />
            <div className="pb-20">
                {/* Outlet for nested routes */}
                <Outlet />
            </div>

            {/* footer */}
            <Footer />

            {/* Global Chatbot */}
            <NourishBot />
        </div>
    );
};

export default MainLayout;