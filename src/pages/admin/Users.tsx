import { useState } from "react";
import { UserAdd01Icon, CloudUploadIcon, MoreVerticalIcon, PencilEdit02Icon } from "hugeicons-react";
import { PageHeader, Card, CardHeader, Badge, statusTone, Button, Avatar, Table, THead, TRow, TCell, SearchInput, Select, Tabs, StatCard } from "../../components/ui";
import { students, staff } from "../../data/mock";

export default function AdminUsers() {
  const [tab, setTab] = useState("Students");
  const [query, setQuery] = useState("");

  const filteredStudents = students.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.id.toLowerCase().includes(query.toLowerCase()));
  const filteredStaff = staff.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.role.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        subtitle="Manage staff, teacher, student and parent accounts."
        actions={
          <>
            <Button variant="secondary" icon={<CloudUploadIcon size={18} />}>Bulk import CSV</Button>
            <Button icon={<UserAdd01Icon size={18} />}>Add user</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Student accounts" value="184" delta="6 new" deltaLabel="this month" />
        <StatCard label="Staff accounts" value="41" delta="2 new" deltaLabel="this month" iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Parent accounts" value="203" delta="11 new" deltaLabel="this month" iconBg="bg-success-50 text-success-600" />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="All accounts"
          subtitle="Assign roles, reset passwords, and manage access."
          action={<Tabs tabs={["Students", "Staff"]} active={tab} onChange={setTab} />}
        />
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-5 py-3.5">
          <SearchInput placeholder={`Search ${tab.toLowerCase()}…`} className="w-72" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select options={tab === "Students" ? ["All classes", "JHS 1", "JHS 2", "JHS 3"] : ["All departments", "Sciences", "Languages", "Humanities", "Finance"]} />
          <Select options={["All statuses", "Active", "Suspended", "Archived"]} />
        </div>

        {tab === "Students" ? (
          <Table>
            <THead cols={["Student", "ID", "Class", "Guardian", "Status", ""]} />
            <tbody>
              {filteredStudents.map((s) => (
                <TRow key={s.id}>
                  <TCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} color={s.avatarColor} size="sm" />
                      <span className="font-semibold text-gray-900">{s.name}</span>
                    </div>
                  </TCell>
                  <TCell>{s.id}</TCell>
                  <TCell>{s.class}</TCell>
                  <TCell>{s.guardian}</TCell>
                  <TCell><Badge tone={statusTone(s.status)} dot>{s.status}</Badge></TCell>
                  <TCell>
                    <div className="flex items-center gap-1">
                      <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"><PencilEdit02Icon size={18} /></button>
                      <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"><MoreVerticalIcon size={18} /></button>
                    </div>
                  </TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        ) : (
          <Table>
            <THead cols={["Staff member", "Role", "Department", "Contact", "Status", ""]} />
            <tbody>
              {filteredStaff.map((s) => (
                <TRow key={s.id}>
                  <TCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.id}</p>
                      </div>
                    </div>
                  </TCell>
                  <TCell>{s.role}</TCell>
                  <TCell>{s.department}</TCell>
                  <TCell>
                    <p>{s.email}</p>
                    <p className="text-xs text-gray-400">{s.phone}</p>
                  </TCell>
                  <TCell><Badge tone={statusTone(s.status)} dot>{s.status}</Badge></TCell>
                  <TCell>
                    <div className="flex items-center gap-1">
                      <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"><PencilEdit02Icon size={18} /></button>
                      <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"><MoreVerticalIcon size={18} /></button>
                    </div>
                  </TCell>
                </TRow>
              ))}
            </tbody>
          </Table>
        )}
        <div className="flex items-center justify-between px-5 py-3.5 text-sm text-gray-500">
          <span>Showing {tab === "Students" ? filteredStudents.length : filteredStaff.length} of {tab === "Students" ? 184 : 41} accounts</span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Previous</Button>
            <Button variant="secondary" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
