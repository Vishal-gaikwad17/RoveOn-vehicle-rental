import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div>
      <h2 className="mb-5 font-display text-xl font-semibold text-slate-100">Users</h2>

      {loading && <p className="text-slate-500">Loading users...</p>}

      <div className="overflow-x-auto rounded-xl border border-asphalt-700">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-asphalt-800 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-asphalt-700">
            {users.map((u) => (
              <tr key={u._id} className="bg-asphalt-900">
                <td className="px-4 py-3 font-medium text-slate-100">{u.name}</td>
                <td className="px-4 py-3 text-slate-400">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.role === "admin" ? "bg-amber-500/20 text-amber-400" : "bg-asphalt-700 text-slate-300"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {u.role !== "admin" && (
                    <button onClick={() => handleDelete(u._id)} className="text-signal-red hover:text-red-400">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && users.length === 0 && <p className="p-6 text-center text-slate-500">No users found.</p>}
      </div>
    </div>
  );
};

export default AdminUsers;
