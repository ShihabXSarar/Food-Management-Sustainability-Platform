import React, { useState } from 'react';
import { MapPin, Heart, Clock, ArrowRight, X, Send, Phone, Mail } from 'lucide-react';
import { CommunityPost } from '../types';

// Dummy data for the bonus feature
const DUMMY_POSTS: CommunityPost[] = [
  { id: '1', title: 'গাছের সবজি - টমেটো ও পুদিনা', distance: '0.4 km', type: 'Surplus', items: ['টমেটো (2 kg)', 'পুদিনা পাতা', 'মরিচ'] },
  { id: '2', title: 'দোকান বন্ধ - চাল ও ডাল সাশ্রয়ী মূল্যে', distance: '1.2 km', type: 'Surplus', items: ['বাসমতি চাল', 'মসুর ডাল', 'ছোলা'] },
  { id: '3', title: 'দাতব্য অনুষ্ঠানের জন্য পেঁয়াজ প্রয়োজন', distance: '0.8 km', type: 'Request', items: ['পেঁয়াজ (3 kg)', 'রসুন'] },
];

const CommunityHub: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState({ name: '', phone: '' });

  const handleConnect = (post: CommunityPost) => {
    setSelectedPost(post);
  };

  const handleSendMessage = () => {
    if (message.trim() && contactInfo.name.trim()) {
      alert(`Message sent to "${selectedPost?.title}" from ${contactInfo.name}:\n\n"${message}"`);
      setMessage('');
      setContactInfo({ name: '', phone: '' });
      setSelectedPost(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            Community Sharing
          </h2>
          <p className="text-sm text-slate-500">Find or share surplus food nearby.</p>
        </div>
        <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition shadow-sm">
          Post Item
        </button>
      </div>

      {/* Map Placeholder */}
      <div className="w-full h-48 bg-slate-200 rounded-xl flex items-center justify-center border border-slate-300 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center"></div>
         <button 
           onClick={() => setShowMap(!showMap)}
           className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium z-10 hover:bg-slate-50 transition">
            <MapPin className="w-4 h-4 text-rose-500" />
            {showMap ? 'Hide Map' : 'View Map'}
         </button>
      </div>

      {showMap && (
        <div className="w-full h-80 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border border-slate-300 p-4 relative">
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-center">
              <div className="bg-white bg-opacity-90 p-6 rounded-lg">
                <MapPin className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <p className="font-medium text-slate-800 mb-2">Interactive Map</p>
                <p className="text-sm text-slate-500 mb-4">Showing {DUMMY_POSTS.length} community posts nearby</p>
                <div className="space-y-2">
                  {DUMMY_POSTS.map((post) => (
                    <div key={post.id} className="text-xs bg-slate-50 p-2 rounded border border-slate-200">
                      <div className="flex items-center gap-2 justify-center">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span className="font-medium">{post.title}</span>
                        <span className="text-slate-400">{post.distance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DUMMY_POSTS.map((post) => (
          <div key={post.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-rose-200 transition cursor-pointer">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${post.type === 'Surplus' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {post.type}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {post.distance}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{post.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{post.items.join(', ')}</p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
               <div className="flex items-center gap-1 text-xs text-slate-400">
                 <Clock className="w-3 h-3" />
                 <span>2h ago</span>
               </div>
               <button 
                 onClick={() => handleConnect(post)}
                 className="text-rose-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all hover:text-rose-600">
                 Connect <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedPost.title}</h3>
                <p className="text-xs text-slate-500">{selectedPost.type}</p>
              </div>
              <button 
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg mb-4">
              <p className="text-xs font-medium text-slate-600 mb-2">Items:</p>
              <div className="flex flex-wrap gap-1">
                {selectedPost.items.map((item, idx) => (
                  <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Name</label>
                <input 
                  type="text"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Phone (optional)</label>
                <input 
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  placeholder="Your phone number"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={selectedPost.type === 'Surplus' ? 'When can I pick this up?' : 'I can help with this!'}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedPost(null)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium text-sm">
                Cancel
              </button>
              <button 
                onClick={handleSendMessage}
                className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition font-medium text-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityHub;
