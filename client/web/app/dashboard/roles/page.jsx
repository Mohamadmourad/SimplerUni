"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { checkAuth } from "@/app/functions/checkAuth";
import { useRouter } from "next/navigation";

const predefinedPermissions = [
  "rolesPage",
  "adminPage",
  "domainsPage",
  "majorsPage",
  "campususPage",
  "analyticsPage",
  "usersManagementPage"
];

const Roles = () => {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getRolesData = async () => {
      const result = await axios.get(NEXT_PUBLIC_END_POINT + "/role/getRoles", { withCredentials: true });
      const rolesArray = result.data;
      const temp = [];
      for (let role of rolesArray) {
        const roleData = {
          id: role.roleid,
          name: role.rolename,
          permissions: role.permissions
        }
        temp.push(roleData);
      }
      setRoles(temp);
    }
    getRolesData();

    const verify = async () => {
      try{
       const result = await checkAuth("rolesPage");
       result == false ? router.push("/") : null;
     }
       catch(e){router.push("/")}
     };
     verify();
  }, []);

  const handleAddRole = async () => {
    if (!roleName.trim()) return;
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        NEXT_PUBLIC_END_POINT + "/role/addRole",
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
      await axios.delete(`http://localhost:5000/role/deleteRole/${roleId}`, {
        withCredentials: true,
      });

      setRoles(roles.filter((role) => role.id !== roleId));
    } catch (err) {
      setError("Failed to delete role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = async () => {
    if (!editingRole) return;
    setError("");
    setLoading(true);

    try {
      await axios.put(
        `http://localhost:5000/role/updateRolePermissions`,
        {
          roleId: editingRole.id,
          permissions: editingRole.permissions
        },
        { withCredentials: true }
      );

      setRoles(roles.map(role => 
        role.id === editingRole.id ? editingRole : role
      ));
      setIsEditModalOpen(false);
      setEditingRole(null);
    } catch (err) {
      setError("Failed to update role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDeletable = (permissions) => {
    return permissions.includes("universityDashboard");
  }

  const handlePermissionToggle = (permission) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permission));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  const handleEditPermissionToggle = (permission) => {
    if (!editingRole) return;
    
    const newPermissions = editingRole.permissions.includes(permission)
      ? editingRole.permissions.filter(p => p !== permission)
      : [...editingRole.permissions, permission];
    
    setEditingRole({
      ...editingRole,
      permissions: newPermissions
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-none p-3">
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
      </div>

      <div className="bg-gray-900 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-3">Existing Roles</h2>
      

      <div className="flex-1 px-8 pb-8 overflow-y-auto">
        <div className="space-y-2">
          {roles.length > 0 ? (
            roles.map((role) => (
              <div key={role.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-700 rounded-lg">
                <div>
                  <span className="text-gray-300 font-semibold">{role.name}</span>
                  <p className="text-gray-400 text-sm">
                    {role.permissions.length ? role.permissions.join(", ") : "No permissions assigned"}
                  </p>
                </div>
                <div className="space-x-2">
                  <button 
                    onClick={() => {
                      setEditingRole(role);
                      setIsEditModalOpen(true);
                    }}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
                    disabled={loading || isDeletable(role.permissions)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    disabled={loading || isDeletable(role.permissions)}
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
      </div>
      {isEditModalOpen && editingRole && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white">Edit Role</h2>
            
            <div className="mb-4">
              <label className="block text-sm mb-1 text-gray-300">Role Name</label>
              <input
                type="text"
                value={editingRole.name}
                onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500 text-white"
                placeholder="Role name"
              />
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 text-gray-300">Permissions</h3>
              <div className="grid grid-cols-2 gap-2">
                {predefinedPermissions.map((perm) => (
                  <label key={perm} className="flex items-center space-x-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={editingRole.permissions.includes(perm)}
                      onChange={() => handleEditPermissionToggle(perm)}
                      className="form-checkbox h-4 w-4 text-purple-600"
                    />
                    <span>{perm}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleEditRole}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;