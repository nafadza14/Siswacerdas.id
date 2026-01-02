
import React, { useState, useRef } from 'react';
import { MOCK_BLOG_POSTS } from '../../constants';
import { BlogPost } from '../../types';
import { Edit2, Trash2, Plus, X, Save, Upload, Image as ImageIcon, Camera } from 'lucide-react';

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setImagePreview(post.imageUrl);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentPost({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      author: 'Admin Sekolah',
      category: 'Berita'
    });
    setImagePreview(null);
    setIsEditing(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setCurrentPost(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!currentPost.title || !currentPost.content) {
      alert("Judul dan Konten wajib diisi");
      return;
    }

    const postToSave = {
      ...currentPost,
      imageUrl: imagePreview || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000'
    } as BlogPost;

    if (posts.find(p => p.id === postToSave.id)) {
      setPosts(prev => prev.map(p => p.id === postToSave.id ? postToSave : p));
    } else {
      setPosts(prev => [postToSave, ...prev]);
    }
    setIsEditing(false);
    setCurrentPost({});
    setImagePreview(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-dark">Manajemen Blog & Berita</h1>
           <p className="text-gray-500">Kelola artikel, pengumuman, dan berita sekolah</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-teal-100 hover:bg-teal-600 transition"
        >
           <Plus size={18} /> Tulis Artikel Baru
        </button>
      </div>

      {/* Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
           <div className="bg-white w-full max-w-4xl rounded-[40px] p-8 shadow-2xl relative animate-fade-in-up my-8">
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} className="text-gray-400" />
              </button>
              
              <h2 className="text-2xl font-black text-dark mb-8">
                {posts.find(p => p.id === currentPost.id) ? 'Edit Artikel' : 'Buat Artikel Baru'}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Image Upload & Category */}
                <div className="lg:col-span-1 space-y-6">
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Foto Sampul</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video lg:aspect-square bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 overflow-hidden relative group cursor-pointer hover:border-primary/50 transition-all"
                      >
                         {imagePreview ? (
                            <img src={imagePreview} className="w-full h-full object-cover" />
                         ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                               <ImageIcon size={40} strokeWidth={1.5} />
                               <p className="text-[10px] font-bold mt-2 uppercase">Klik untuk Upload</p>
                            </div>
                         )}
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <Upload className="text-white" size={32} />
                         </div>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Kategori</label>
                      <select 
                        value={currentPost.category || ''} 
                        onChange={e => setCurrentPost({...currentPost, category: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary"
                      >
                         <option value="Berita">Berita Utama</option>
                         <option value="Pengumuman">Pengumuman</option>
                         <option value="Prestasi">Prestasi Siswa</option>
                         <option value="Event">Kegiatan Sekolah</option>
                         <option value="Environment">Lingkungan (Adiwiyata)</option>
                      </select>
                   </div>
                </div>

                {/* Right Column: Title, Excerpt, Content */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Judul Artikel</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan judul yang menarik..."
                      value={currentPost.title || ''} 
                      onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 font-bold text-lg focus:ring-2 focus:ring-primary focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Ringkasan (Excerpt)</label>
                    <textarea 
                      placeholder="Jelaskan isi artikel secara singkat..."
                      value={currentPost.excerpt || ''} 
                      onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})}
                      rows={2}
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Konten Lengkap</label>
                    <textarea 
                      placeholder="Tulis detail artikel di sini..."
                      value={currentPost.content || ''} 
                      onChange={e => setCurrentPost({...currentPost, content: e.target.value})}
                      rows={8}
                      className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm leading-relaxed focus:ring-2 focus:ring-primary focus:bg-white transition custom-scrollbar"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-50">
                 <button onClick={() => setIsEditing(false)} className="px-8 py-3 text-gray-400 font-bold hover:text-dark transition">Batal</button>
                 <button 
                  onClick={handleSave} 
                  className="px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-teal-100 hover:bg-teal-600 flex items-center gap-2 transition active:scale-95"
                 >
                   <Save size={20} /> Simpan & Publikasikan
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Articles List Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-gray-50/50 border-b border-gray-100">
                 <th className="p-6 font-bold text-[10px] text-gray-400 uppercase tracking-widest">Artikel</th>
                 <th className="p-6 font-bold text-[10px] text-gray-400 uppercase tracking-widest w-40">Kategori</th>
                 <th className="p-6 font-bold text-[10px] text-gray-400 uppercase tracking-widest w-40">Tanggal</th>
                 <th className="p-6 font-bold text-[10px] text-gray-400 uppercase tracking-widest w-40">Penulis</th>
                 <th className="p-6 font-bold text-[10px] text-gray-400 uppercase tracking-widest w-32 text-center">Aksi</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
               {posts.map(post => (
                 <tr key={post.id} className="group hover:bg-gray-50/50 transition">
                   <td className="p-6">
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                            <img src={post.imageUrl} className="w-full h-full object-cover" />
                         </div>
                         <div className="min-w-0">
                            <p className="font-bold text-dark text-sm truncate leading-tight group-hover:text-primary transition-colors">{post.title}</p>
                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{post.excerpt}</p>
                         </div>
                      </div>
                   </td>
                   <td className="p-6">
                     <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                       {post.category}
                     </span>
                   </td>
                   <td className="p-6 text-xs text-gray-500 font-medium">{post.date}</td>
                   <td className="p-6 text-xs text-gray-500 font-medium">{post.author}</td>
                   <td className="p-6">
                     <div className="flex justify-center gap-2">
                       <button 
                        onClick={() => handleEdit(post)} 
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition"
                        title="Edit Artikel"
                       >
                         <Edit2 size={16} />
                       </button>
                       <button 
                        onClick={() => handleDelete(post.id)} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                        title="Hapus Artikel"
                       >
                         <Trash2 size={16} />
                       </button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
        {posts.length === 0 && (
          <div className="py-20 text-center text-gray-400 italic">
            Belum ada artikel. Klik "Tulis Artikel Baru" untuk memulai.
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManager;
