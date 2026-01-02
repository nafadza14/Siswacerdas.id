import React from 'react';
import { Database, Server } from 'lucide-react';

const SystemArchitecture: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-dark mb-6">System Architecture & Deliverables</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Step 1: Database Schema */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Database size={24} />
            </div>
            <h2 className="text-xl font-bold">Step 1: Database Schema (Prisma)</h2>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <pre className="text-xs text-green-400 font-mono">
{`model School {
  id        String   @id @default(uuid())
  name      String
  users     User[]
  classes   Class[]
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  role      Role     @default(STUDENT)
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id])
  // Profile fields...
  student   Student?
  teacher   Teacher?
}

model Student {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  classId   String
  class     Class    @relation(fields: [classId], references: [id])
  attendance Attendance[]
  examResults ExamResult[]
}

model Attendance {
  id        String   @id @default(uuid())
  studentId String
  date      DateTime
  status    Status   @default(ABSENT) // PRESENT, LATE, ABSENT
  method    String   // 'SELFIE', 'QR', 'TEACHER'
  lat       Float?
  lng       Float?
}

model Exam {
  id        String   @id @default(uuid())
  title     String
  questions Json     // Array of Question objects
  results   ExamResult[]
}`}
            </pre>
          </div>
        </div>

        {/* Step 2: API Structure */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
           <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <Server size={24} />
            </div>
            <h2 className="text-xl font-bold">Step 2: API Routes (Next.js)</h2>
          </div>

          <div className="space-y-4">
             {[
               { method: 'POST', path: '/api/v1/auth/login', desc: 'JWT Authentication' },
               { method: 'POST', path: '/api/v1/attendance/scan', desc: 'Process QR/Selfie + Geo Check' },
               { method: 'GET', path: '/api/v1/classes/:id/students', desc: 'Get list for teacher view' },
               { method: 'POST', path: '/api/v1/exams/:id/start', desc: 'Init exam session & timer' },
               { method: 'POST', path: '/api/v1/exams/:id/submit', desc: 'Calc score & save result' },
               { method: 'POST', path: '/api/v1/webhooks/whatsapp', desc: 'Trigger parent notification' },
             ].map((route, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      route.method === 'POST' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>{route.method}</span>
                    <span className="font-mono text-sm text-gray-700">{route.path}</span>
                  </div>
                  <span className="text-xs text-gray-400">{route.desc}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemArchitecture;
