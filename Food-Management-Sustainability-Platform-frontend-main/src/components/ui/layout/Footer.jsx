import { Leaf } from 'lucide-react';
import React from 'react';

const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                                <Leaf size={20} className="text-white" />
                            </div>
                            <span className="font-bold text-xl">EcoFood</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            Smart food management platform empowering individuals and businesses to build a sustainable future.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li><a href="#features" className="hover:text-green-600 transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-green-600 transition-colors">Pricing</a></li>
                            <li><a href="#security" className="hover:text-green-600 transition-colors">Security</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li><a href="#about" className="hover:text-green-600 transition-colors">About</a></li>
                            <li><a href="#blog" className="hover:text-green-600 transition-colors">Blog</a></li>
                            <li><a href="#contact" className="hover:text-green-600 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li><a href="#privacy" className="hover:text-green-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#terms" className="hover:text-green-600 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© 2024 FreshFlow. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;