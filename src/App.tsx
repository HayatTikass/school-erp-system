import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";
import { AppStoreProvider } from "./store/AppStore";
import { AuthProvider, RequireAuth, useAuth } from "./auth/AuthContext";
import { ToastProvider } from "./components/Toast";
import { ROLE_META, type Role } from "./types/roles";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminAdmissions from "./pages/admin/Admissions";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";

import AdminClasses from "./pages/admin/academics/Classes";
import AdminSubjects from "./pages/admin/academics/Subjects";
import AdminTimetable from "./pages/admin/academics/Timetable";
import AdminGrading from "./pages/admin/academics/Grading";
import AdminAttendanceOverview from "./pages/admin/attendance/Overview";
import AdminDiscipline from "./pages/admin/attendance/Discipline";
import AdminFinanceOverview from "./pages/admin/finance/Overview";
import AdminInvoices from "./pages/admin/finance/Invoices";
import AdminFeeStructure from "./pages/admin/finance/FeeStructure";
import AdminStaffDirectory from "./pages/admin/hr/StaffDirectory";
import AdminLeaveRequests from "./pages/admin/hr/LeaveRequests";
import AdminPayroll from "./pages/admin/hr/Payroll";
import AdminCatalogue from "./pages/admin/library/Catalogue";
import AdminLoans from "./pages/admin/library/Loans";
import AdminAssets from "./pages/admin/inventory/Assets";
import AdminMaintenance from "./pages/admin/inventory/Maintenance";
import AdminRoutes from "./pages/admin/transport/Routes";
import AdminRouteAssignments from "./pages/admin/transport/Assignments";
import AdminNotices from "./pages/admin/communication/Notices";
import AdminEvents from "./pages/admin/communication/Events";

import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherGradebook from "./pages/teacher/Gradebook";
import TeacherLessons from "./pages/teacher/Lessons";
import TeacherAssignments from "./pages/teacher/Assignments";
import TeacherClasses from "./pages/teacher/Classes";
import TeacherReportCards from "./pages/teacher/ReportCards";
import TeacherMessages from "./pages/teacher/Messages";

import StudentDashboard from "./pages/student/Dashboard";
import StudentResults from "./pages/student/Results";
import StudentAssignments from "./pages/student/Assignments";
import StudentTimetable from "./pages/student/Timetable";
import StudentAttendance from "./pages/student/Attendance";
import StudentFees from "./pages/student/Fees";
import StudentLibrary from "./pages/student/Library";
import StudentNotices from "./pages/student/Notices";
import StudentProfile from "./pages/student/Profile";

import ParentDashboard from "./pages/parent/Dashboard";
import ParentProgress from "./pages/parent/Progress";
import ParentAttendance from "./pages/parent/Attendance";
import ParentAssignments from "./pages/parent/Assignments";
import ParentTimetable from "./pages/parent/Timetable";
import ParentFees from "./pages/parent/Fees";
import ParentMessages from "./pages/parent/Messages";
import ParentProfile from "./pages/parent/Profile";

import {
  HeadmasterDashboard,
  LibrarianDashboard,
  HRDashboard,
} from "./pages/RoleDashboards";
import AccountantDashboard from "./pages/accountant/Dashboard";
import FeeLedger from "./pages/accountant/FeeLedger";
import Payments from "./pages/accountant/Payments";

function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to={ROLE_META[user.role].portalPath} replace />;
  return <Login />;
}

function Portal({ role }: { role: Role }) {
  return (
    <RequireAuth role={role}>
      <AppShell role={role} />
    </RequireAuth>
  );
}

export default function App() {
  return (
    <AppStoreProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/admin" element={<Portal role="admin" />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="admissions" element={<AdminAdmissions />} />

                <Route path="academics" element={<Navigate to="classes" replace />} />
                <Route path="academics/classes" element={<AdminClasses />} />
                <Route path="academics/subjects" element={<AdminSubjects />} />
                <Route path="academics/timetable" element={<AdminTimetable />} />
                <Route path="academics/grading" element={<AdminGrading />} />

                <Route path="attendance" element={<AdminAttendanceOverview />} />
                <Route path="discipline" element={<AdminDiscipline />} />

                <Route path="finance" element={<AdminFinanceOverview />} />
                <Route path="finance/invoices" element={<AdminInvoices />} />
                <Route path="finance/fee-structure" element={<AdminFeeStructure />} />

                <Route path="hr" element={<Navigate to="staff" replace />} />
                <Route path="hr/staff" element={<AdminStaffDirectory />} />
                <Route path="hr/leave" element={<AdminLeaveRequests />} />
                <Route path="hr/payroll" element={<AdminPayroll />} />

                <Route path="library" element={<Navigate to="catalogue" replace />} />
                <Route path="library/catalogue" element={<AdminCatalogue />} />
                <Route path="library/loans" element={<AdminLoans />} />

                <Route path="inventory" element={<Navigate to="assets" replace />} />
                <Route path="inventory/assets" element={<AdminAssets />} />
                <Route path="inventory/maintenance" element={<AdminMaintenance />} />

                <Route path="transport" element={<Navigate to="routes" replace />} />
                <Route path="transport/routes" element={<AdminRoutes />} />
                <Route path="transport/assignments" element={<AdminRouteAssignments />} />

                <Route path="communication" element={<Navigate to="notices" replace />} />
                <Route path="communication/notices" element={<AdminNotices />} />
                <Route path="communication/events" element={<AdminEvents />} />

                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="/headmaster" element={<Portal role="headmaster" />}>
                <Route index element={<HeadmasterDashboard />} />
                <Route path="admissions" element={<AdminAdmissions />} />
                <Route path="academics" element={<Navigate to="classes" replace />} />
                <Route path="academics/classes" element={<AdminClasses />} />
                <Route path="academics/subjects" element={<AdminSubjects />} />
                <Route path="academics/timetable" element={<AdminTimetable />} />
                <Route path="academics/grading" element={<AdminGrading />} />
                <Route path="attendance" element={<AdminAttendanceOverview />} />
                <Route path="discipline" element={<AdminDiscipline />} />
                <Route path="communication" element={<Navigate to="notices" replace />} />
                <Route path="communication/notices" element={<AdminNotices />} />
                <Route path="communication/events" element={<AdminEvents />} />
                <Route path="reports" element={<AdminReports />} />
              </Route>

              <Route path="/accountant" element={<Portal role="accountant" />}>
                <Route index element={<AccountantDashboard />} />
                <Route path="ledger" element={<FeeLedger />} />
                <Route path="payments" element={<Payments />} />
                <Route path="finance" element={<AdminFinanceOverview />} />
                <Route path="finance/invoices" element={<AdminInvoices />} />
                <Route path="finance/fee-structure" element={<AdminFeeStructure />} />
                <Route path="reports" element={<AdminReports />} />
              </Route>

              <Route path="/librarian" element={<Portal role="librarian" />}>
                <Route index element={<LibrarianDashboard />} />
                <Route path="library" element={<Navigate to="/librarian/catalogue" replace />} />
                <Route path="catalogue" element={<AdminCatalogue />} />
                <Route path="loans" element={<AdminLoans />} />
              </Route>

              <Route path="/hr" element={<Portal role="hr" />}>
                <Route index element={<HRDashboard />} />
                <Route path="staff" element={<AdminStaffDirectory />} />
                <Route path="leave" element={<AdminLeaveRequests />} />
                <Route path="payroll" element={<AdminPayroll />} />
              </Route>

              <Route path="/teacher" element={<Portal role="teacher" />}>
                <Route index element={<TeacherDashboard />} />
                <Route path="attendance" element={<TeacherAttendance />} />
                <Route path="gradebook" element={<TeacherGradebook />} />
                <Route path="lessons" element={<TeacherLessons />} />
                <Route path="assignments" element={<TeacherAssignments />} />
                <Route path="classes" element={<TeacherClasses />} />
                <Route path="report-cards" element={<TeacherReportCards />} />
                <Route path="messages" element={<TeacherMessages />} />
              </Route>

              <Route path="/student" element={<Portal role="student" />}>
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

              <Route path="/parent" element={<Portal role="parent" />}>
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
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </AppStoreProvider>
  );
}
