
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { MOCK_BLOG_POSTS } from '../constants';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
// Fix: Re-writing the import to resolve "no exported member" errors
import { Link } from "react-router-dom";

const BlogPublic: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(MOCK_BLOG_POSTS.map(p => p.category)))];

  const filteredPosts = MOCK_BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#fffcf8]">
      <Navbar />

      {/* Header */}
      <header className="bg-primary pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <span className="inline-block px-4 py-1 bg-white/20 text-white rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
             SMA 1 Sooko Mojokerto
           </span>
           <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
             School Sustainability Blog
           </h1>
           <p className="text-white/80 text-lg max-w-2xl mx-auto">
             Updates on our Adiwiyata journey, student initiatives, and green innovations towards a sustainable future.
           </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 pb-20">
        {/* Search & Filter */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mb-12">
           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                {/* Fixed: Added explicit type to cat to fix 'unknown' errors */}
                {categories.map((cat: string) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-secondary text-white' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredPosts.map((post) => (
             <article key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col h-full group">
                <div className="h-56 overflow-hidden relative">
                   <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-primary uppercase">
                     {post.category}
                   </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                      <span className="flex items-center gap-1"><User size={12}/> {post.author}</span>
                   </div>
                   
                   <h2 className="text-xl font-bold text-dark mb-3 leading-tight group-hover:text-primary transition-colors">
                     {post.title}
                   </h2>
                   <p className="text-gray-500 text-sm mb-6 flex-1">
                     {post.excerpt}
                   </p>
                   
                   <Link to={`/blog/${post.id}`} className="inline-flex items-center text-secondary font-bold hover:text-orange-600 transition">
                     Read Article <ArrowRight size={16} className="ml-2" />
                   </Link>
                </div>
             </article>
           ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPublic;
