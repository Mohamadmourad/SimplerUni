"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const result = await axios.get("http://localhost:5000/admin/getAllAdmins", { withCredentials: true });
        console.log(result.data)
        const adminsArray = result.data;
        const temp = adminsArray.map(admin => ({
          id: admin.adminid,
          firstName: admin.firstName,
          lastName: admin.lastName,
          username: admin.username,
          roleId: admin.rolename
        }));
        setAdmins(temp);
      } catch (err) {
        setError("Failed to fetch admins.");
      }
    };

    const fetchRoles = async () => {
      try {
        const result = await axios.get("http://localhost:5000/role/getRoles", { withCredentials: true });
        const rolesArray = result.data;
        const temp = rolesArray.map(role => ({
          id: role.roleid,
          name: role.rolename,
          permissions: role.permissions
        }));
        setRoles(temp);
      } catch (err) {
        setError("Failed to fetch roles.");
      }
    };

    fetchAdmins();
    fetchRoles();
  }, []);

  const handleAddAdmin = async () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !password.trim() || !roleId) return;
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/admin/addAdmin", { firstName, lastName, username, password, roleId }, { withCredentials: true });
      setAdmins([...admins, { id: response.data.adminId, firstName, lastName, username, roleId }]);
      setFirstName("");
      setLastName("");
      setUsername("");
      setPassword("");
      setRoleId("");
    } catch (err) {
      setError("Failed to add admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    setError("");
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/admin/deleteAdmin/${adminId}`, { withCredentials: true });
      setAdmins(admins.filter((admin) => admin.id !== adminId));
    } catch (err) {
      setError("Failed to delete admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAdmin = async () => {
    if (!editingAdmin) return;
    setError("");
    setLoading(true);
    try {
      await axios.put("http://localhost:5000/admin/updateAdmin", editingAdmin, { withCredentials: true });
      setAdmins(admins.map(admin => (admin.id === editingAdmin.id ? editingAdmin : admin)));
      setIsEditModalOpen(false);
      setEditingAdmin(null);
    } catch (err) {
      setError("Failed to update admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col p-6">
      <h1 className="text-2xl font-bold text-white">Manage Admins</h1>
      {error && <p className="text-red-500">{error}</p>}

      <h2 className="text-xl font-semibold text-white mt-6">Add Admin</h2>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="p-2 bg-gray-700 text-white rounded" />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="p-2 bg-gray-700 text-white rounded" />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="p-2 bg-gray-700 text-white rounded" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 bg-gray-700 text-white rounded" />
        <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="p-2 bg-gray-700 text-white rounded">
        <option value="">Select Role</option>
        {roles.map((role, index) => (
          <option key={`${role.id}-${index}`} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>
      </div>
      <button onClick={handleAddAdmin} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded">Add Admin</button>

      <h2 className="text-xl font-semibold text-white mt-6">Existing Admins</h2>
      {admins.map(admin => (
        <div key={admin.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg mt-2">
          <span className="text-white">{admin.firstName} {admin.lastName} ({admin.username})</span>
          <div>
            <button onClick={() => { setEditingAdmin(admin); setIsEditModalOpen(true); }} className="px-3 py-1 bg-purple-600 text-white rounded">Edit</button>
            <button onClick={() => handleDeleteAdmin(admin.id)} className="px-3 py-1 bg-red-600 text-white rounded ml-2">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Admins;
