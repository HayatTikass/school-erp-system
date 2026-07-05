import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";

/* Admin */
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminAdmissions from "./pages/admin/Admissions";
import AdminAcademics from "./pages/admin/Academics";
import AdminAttendance from "./pages/admin/Attendance";
import AdminFinance from "./pages/admin/Finance";
import AdminHR from "./pages/admin/HR";
import AdminLibrary from "./pages/admin/Library";
import AdminInventory from "./pages/admin/Inventory";
import AdminTransport from "./pages/admin/Transport";
import AdminCommunication from "./pages/admin/Communication";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";

/* Teacher */
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherGradebook from "./pages/teacher/Gradebook";
import TeacherLessons from "./pages/teacher/Lessons";
import TeacherAssignments from "./pages/teacher/Assignments";
import TeacherClasses from "./pages/teacher/Classes";
import TeacherReportCards from "./pages/teacher/ReportCards";
import TeacherMessages from "./pages/teacher/Messages";

/* Student */
import StudentDashboard from "./pages/student/Dashboard";
import StudentResults from "./pages/student/Results";
import StudentAssignments from "./pages/student/Assignments";
import StudentTimetable from "./pages/student/Timetable";
import StudentAttendance from "./pages/student/Attendance";
import StudentFees from "./pages/student/Fees";
import StudentLibrary from "./pages/student/Library";
import StudentNotices from "./pages/student/Notices";
import StudentProfile from "./pages/student/Profile";

/* Parent */
import ParentDashboard from "./pages/parent/Dashboard";
import ParentProgress from "./pages/parent/Progress";
import ParentAttendance from "./pages/parent/Attendance";
import ParentAssignments from "./pages/parent/Assignments";
import ParentTimetable from "./pages/parent/Timetable";
import ParentFees from "./pages/parent/Fees";
import ParentMessages from "./pages/parent/Messages";
import ParentProfile from "./pages/parent/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AppShell role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="admissions" element={<AdminAdmissions />} />
          <Route path="academics" element={<AdminAcademics />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="hr" element={<AdminHR />} />
          <Route path="library" element={<AdminLibrary />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="transport" element={<AdminTransport />} />
          <Route path="communication" element={<AdminCommunication />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="/teacher" element={<AppShell role="teacher" />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="gradebook" element={<TeacherGradebook />} />
          <Route path="lessons" element={<TeacherLessons />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="report-cards" element={<TeacherReportCards />} />
          <Route path="messages" element={<TeacherMessages />} />
        </Route>

        <Route path="/student" element={<AppShell role="student" />}>
          <Route index element={<StudentDashboard />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="timetable" element={<StudentTimetable />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="library" element={<StudentLibrary />} />
          <Route path="notices" element={<StudentNotices />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        <Route path="/parent" element={<AppShell role="parent" />}>
          <Route index element={<ParentDashboard />} />
          <Route path="progress" element={<ParentProgress />} />
          <Route path="attendance" element={<ParentAttendance />} />
          <Route path="assignments" element={<ParentAssignments />} />
          <Route path="timetable" element={<ParentTimetable />} />
          <Route path="fees" element={<ParentFees />} />
          <Route path="messages" element={<ParentMessages />} />
          <Route path="profile" element={<ParentProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
