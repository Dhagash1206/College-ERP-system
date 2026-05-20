import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loading from './components/Loading';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import StudentAttendancePage from './pages/student/AttendancePage';
import StudentAttendanceDetailPage from './pages/student/AttendanceDetailPage';
import StudentMarksPage from './pages/student/MarksPage';
import StudentTimetablePage from './pages/student/TimetablePage';
import TeacherAssignmentsPage from './pages/teacher/AssignmentsPage';
import TeacherSessionsPage from './pages/teacher/SessionsPage';
import TeacherAttendancePage from './pages/teacher/AttendancePage';
import TeacherStudentsPage from './pages/teacher/StudentsPage';
import TeacherMarksTestsPage from './pages/teacher/MarksTestsPage';
import TeacherMarksEntryPage from './pages/teacher/MarksEntryPage';
import TeacherStudentMarksPage from './pages/teacher/StudentMarksPage';
import TeacherReportPage from './pages/teacher/ReportPage';
import TeacherTimetablePage from './pages/teacher/TimetablePage';
import TeacherExtraClassPage from './pages/teacher/ExtraClassPage';
import FreeTeachersPage from './pages/teacher/FreeTeachersPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading fullScreen />;
  if (!user) return <Navigate to="/accounts/login/" replace />;
  return children;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <Loading fullScreen />;

  return (
    <Routes>
      <Route
        path="/accounts/login/"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="student/attendance" element={<StudentAttendancePage />} />
        <Route path="student/attendance/:courseId" element={<StudentAttendanceDetailPage />} />
        <Route path="student/marks" element={<StudentMarksPage />} />
        <Route path="student/timetable" element={<StudentTimetablePage />} />
        <Route path="teacher/assignments/:choice" element={<TeacherAssignmentsPage />} />
        <Route path="teacher/assignments/:assignId/sessions" element={<TeacherSessionsPage />} />
        <Route path="teacher/sessions/:sessionId" element={<TeacherAttendancePage />} />
        <Route path="teacher/assignments/:assignId/students" element={<TeacherStudentsPage />} />
        <Route path="teacher/assignments/:assignId/extra-class" element={<TeacherExtraClassPage />} />
        <Route path="teacher/assignments/:assignId/marks" element={<TeacherMarksTestsPage />} />
        <Route path="teacher/marks/:marksClassId" element={<TeacherMarksEntryPage />} />
        <Route path="teacher/assignments/:assignId/student-marks" element={<TeacherStudentMarksPage />} />
        <Route path="teacher/assignments/:assignId/report" element={<TeacherReportPage />} />
        <Route path="teacher/timetable" element={<TeacherTimetablePage />} />
        <Route path="teacher/free-teachers/:assignTimeId" element={<FreeTeachersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
