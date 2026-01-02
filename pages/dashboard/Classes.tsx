import React from 'react';
import { MOCK_CLASSES } from '../../constants';
import { Users, MoreVertical, BookOpen } from 'lucide-react';

const Classes: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-dark">My Classes</h1>
           <p className="text-gray-500">Manage your assigned classes and subjects.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-teal-600 transition">
           + Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CLASSES.map((cls) => (
          <div key={cls.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-secondary font-bold text-xl">
                 {cls.gradeLevel}
              </div>
              <button className="text-gray-400 hover:text-dark"><MoreVertical size={20} /></button>
            </div>
            
            <h3 className="text-xl font-bold text-dark mb-1">{cls.name}</h3>
            <p className="text-gray-500 text-sm mb-6">Wali Kelas: Budi Admin</p>

            <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-50 pt-4">
               <div className="flex items-center gap-1">
                 <Users size={16} />
                 <span>32 Students</span>
               </div>
               <div className="flex items-center gap-1">
                 <BookOpen size={16} />
                 <span>12 Subjects</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;