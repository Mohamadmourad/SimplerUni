"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const predefinedPermissions = [
  "rolesPage",
  "adminPage",
  "domainsPage",
  "majorsPage",
  "campususPage",
  "analyticsPage"
];

const Roles = () => {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(()=>{
    const getRolesData = async ()=>{
        const result = await axios.get("http://localhost:5000/role/getRoles",{ withCredentials: true });
        const rolesArray = result.data.roles;
        for(let role of rolesArray){
            const roleData = {
                id: role.roleId,
                roleName: role.roleName,
                permissions: role.permissions
            }
            roles.push(roleData);
        }
    }
    getRolesData();
  },[]);

  const handleAddRole = async () => {
    if (!roleName.trim()) return;
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/role/addRole",
        { roleName: roleName.trim(), permissions: selectedPermissions },
        { withCredentials: true }
      );

      setRoles([...roles, { id: response.data.roleId, name: roleName.trim(), permissions: selectedPermissions }]);
      setRoleName("");
      setSelectedPermissions([]);
    } catch (err) {
      setError("Failed to add role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    setError("");
    setLoading(true);

    try {
      await axios.delete(`http://localhost:5000/university/removeRole/${roleId}`, {
        withCredentials: true,
      });

      setRoles(roles.filter((role) => role.id !== roleId));
    } catch (err) {
      setError("Failed to delete role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permission) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permission));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  return (
    <div className="p-8 min-h-screen overflow-y-hidden">
      <h1 className="text-2xl font-bold mb-6 text-white">Manage Roles</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h2 className="text-xl font-semibold mb-4 text-white">Add Role</h2>
      <div className="mb-4">
        <label className="block text-sm mb-1">Role Name</label>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
          placeholder="e.g., Admin, Professor"
          disabled={loading}
        />

        <h3 className="text-sm font-semibold mt-3 text-white">Select Permissions</h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {predefinedPermissions.map((perm) => (
            <label key={perm} className="flex items-center space-x-2 text-gray-300">
              <input
                type="checkbox"
                checked={selectedPermissions.includes(perm)}
                onChange={() => handlePermissionToggle(perm)}
                className="form-checkbox h-4 w-4 text-purple-600"
              />
              <span>{perm}</span>
            </label>
          ))}
        </div>

        <button
          onClick={handleAddRole}
          className={`mt-4 px-4 py-2 rounded ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Role"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-4 text-white">Existing Roles</h2>
      <div className="space-y-2">
        {roles.length > 0 ? (
          roles.map((role) => (
            <div key={role.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <div>
                <span className="text-gray-300 font-semibold">{role.name}</span>
                <p className="text-gray-400 text-sm">
                  {role.permissions.length ? role.permissions.join(", ") : "No permissions assigned"}
                </p>
              </div>
              <div className="space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? "Removing..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No roles added.</p>
        )}
      </div>
    </div>
  );
};

export default Roles;
