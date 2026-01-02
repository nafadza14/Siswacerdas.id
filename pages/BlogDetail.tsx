
import React from 'react';
// Fix: Re-writing the import to resolve "no exported member" errors
import { useParams, Link } from "react-router-dom";
import { MOCK_BLOG_POSTS } from '../constants';
import Navbar from '../components/Navbar';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const post = MOCK_BLOG_POSTS.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fffcf8]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
           <h2 className="text-3xl font-bold text-dark">Article Not Found</h2>
           <Link to="/blog" className="text-primary mt-4 inline-block">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf8]">
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 font-medium">
           <ArrowLeft size={18} className="mr-2" /> Back to Articles
        </Link>

        <h1 className="text-3xl md:text-5xl font-extrabold text-dark mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-8 pb-8 border-b border-gray-100">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={16} />
              </div>
              <span className="font-medium">{post.author}</span>
           </div>
           <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{post.date}</span>
           </div>
           <div className="flex items-center gap-2 ml-auto">
             <button className="flex items-center gap-2 text-gray-400 hover:text-secondary">
               <Share2 size={16} /> Share
             </button>
           </div>
        </div>

        <div className="rounded-3xl overflow-hidden mb-10 shadow-lg">
           <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
        </div>

        <div className="prose prose-lg prose-blue max-w-none text-gray-600 leading-relaxed">
           <p className="font-semibold text-xl text-dark mb-6">{post.excerpt}</p>
           {/* Simple split for demo paragraphs since content is plain text */}
           {post.content.split('\n').map((para, i) => (
             <p key={i} className="mb-4">{para}</p>
           ))}
           
           <p className="mt-8 italic text-sm text-gray-400 bg-gray-50 p-4 rounded-xl border-l-4 border-secondary">
             This article is part of the SMA 1 Sooko Mojokerto Sustainability Initiative.
           </p>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
