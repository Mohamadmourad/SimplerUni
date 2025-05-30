"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { checkAuth } from "@/app/functions/checkAuth";

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
  const [currentAdminId, setCurrentAdminId] = useState(null);
  const router = useRouter();

  const fetchCurrentAdmin = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_END_POINT + "/admin/getAdmin", { 
        withCredentials: true 
      });
      if (response.data) {
        setCurrentAdminId(response.data.adminid);
      }
    } catch (err) {
      console.error("Error fetching current admin:", err);
      setError("Failed to fetch current admin information.");
    }
  };
  
  const fetchAdmins = async () => {
    try {
      const result = await axios.get(process.env.NEXT_PUBLIC_END_POINT + "/admin/getAllAdmins", { withCredentials: true });
      if (Array.isArray(result.data)) {
        const temp = result.data.map(admin => ({
          id: admin.adminid,
          firstName: admin.firstname,
          lastName: admin.lastname,
          username: admin.username,
          roleId: admin.roleid,
          roleName: admin.rolename
        }));
        setAdmins(temp);
      } else {
        setError("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to fetch admins.");
    }
  };

  const fetchRoles = async () => {
    try {
      const result = await axios.get(process.env.NEXT_PUBLIC_END_POINT + "/role/getRoles", { withCredentials: true });
      if (Array.isArray(result.data)) {
        const temp = result.data.map(role => ({
          id: role.roleid,
          name: role.rolename,
          permissions: role.permissions
        }));
        setRoles(temp);
      } else {
        setError("Invalid roles data format received from server");
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError("Failed to fetch roles.");
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await fetchCurrentAdmin();
        await fetchAdmins();
        await fetchRoles();
      } catch (err) {
        console.error("Error initializing data:", err);
        setError("Failed to initialize data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    
    initializeData();
    const verify = async () => {
     try{
      const result = await checkAuth("adminsPage");
      result == false ? router.push("/") : null;
    }
      catch(e){router.push("/")}
    };
    verify();
  }, []);

  const clearFormFields = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setRoleId("");
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault(); 
    
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !password.trim() || !roleId) {
      setError("All fields are required");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_END_POINT + "/admin/addAdmin", 
        { firstName, lastName, username, password, roleId }, 
        { withCredentials: true }
      );
      
      await fetchAdmins();

      clearFormFields();
      
    } catch (err) {
      console.error("Error adding admin:", err);
      setError(err.response?.data?.message || "Failed to add admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (adminId === currentAdminId) {
      setError("You cannot delete your own account.");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    
    setError("");
    setLoading(true);
    
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_END_POINT}/admin/deleteAdmin`,
        { data: { adminToDeleteId: adminId } }, 
        { withCredentials: true }
      );
      
      await fetchAdmins();
      
    } catch (err) {
      console.error("Error deleting admin:", err);
      setError(err.response?.data?.message || "Failed to delete admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (admin) => {
    if (admin.adminid === currentAdminId) {
      setError("You cannot edit your own account.");
      return;
    }
    
    setEditingAdmin({...admin});
    setIsEditModalOpen(true);
  };

  const handleEditAdmin = async (e) => {
    e.preventDefault();
    
    if (!editingAdmin) return;
    
    
    if (!editingAdmin.firstName.trim() || !editingAdmin.lastName.trim() || !editingAdmin.username.trim() || !editingAdmin.roleId) {
      setError("All fields are required");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      await axios.put(
        process.env.NEXT_PUBLIC_END_POINT + "/admin/updateAdmin", 
        {
          adminToUpdateId: editingAdmin.id,
          firstName: editingAdmin.firstName,
          lastName: editingAdmin.lastName,
          username: editingAdmin.username,
          roleId: editingAdmin.roleId
        }, 
        { withCredentials: true }
      );
      
      await fetchAdmins();
      
      setIsEditModalOpen(false);
      setEditingAdmin(null);
      
    } catch (err) {
      console.error("Error updating admin:", err);
      setError(err.response?.data?.message || "Failed to update admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if an admin is the current user
  const isCurrentUser = (adminId) => {
    return adminId === currentAdminId;
  };

  return (
    <div className="flex flex-col p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Manage Admins</h1>
      {error && <p className="text-red-500 mb-4 p-3 bg-red-900 bg-opacity-30 rounded">{error}</p>}

      {/* Add Admin Form */}
      <div className="bg-gray-900 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">Add Admin</h2>
        <form onSubmit={handleAddAdmin} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input 
              type="text" 
              placeholder="First Name" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              className="p-2 bg-gray-700 text-white rounded" 
              disabled={loading}
            />
            <input 
              type="text" 
              placeholder="Last Name" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              className="p-2 bg-gray-700 text-white rounded" 
              disabled={loading}
            />
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="p-2 bg-gray-700 text-white rounded" 
              disabled={loading}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="p-2 bg-gray-700 text-white rounded" 
              disabled={loading}
            />
            <select 
              value={roleId} 
              onChange={(e) => setRoleId(e.target.value)} 
              className="p-2 bg-gray-700 text-white rounded md:col-span-2"
              disabled={loading}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <button 
            type="submit" 
            className={`px-4 py-2 ${loading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded transition-colors w-full md:w-auto`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Admin"}
          </button>
        </form>
      </div>

      {/* Admins List */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-3">Existing Admins</h2>
        {loading ? (
          <p className="text-gray-400">Loading admins...</p>
        ) : admins.length === 0 ? (
          <p className="text-gray-400">No admins found.</p>
        ) : (
          <div className="space-y-2">
            
            {admins.map(admin => (
              
              <div 
                key={admin.id}
                
                className={`flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-700 rounded-lg ${
                  isCurrentUser(admin.id) ? 'border-l-4 border-purple-500' : ''
                }`}
              >
                <div className="mb-2 md:mb-0">
                  <div className="flex items-center">
                    <p className="text-white font-medium">{admin.firstName} {admin.lastName}</p>
                    {isCurrentUser(admin.id) && (
                      <span className="ml-2 px-2 py-1 bg-purple-600 text-xs text-white rounded-full">You</span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm">Username: {admin.username}</p>
                  <p className="text-gray-300 text-sm">Role: {admin.roleName}</p>
                </div>
                <div className="flex space-x-2 w-full md:w-auto">
                  <button 
                    onClick={() => openEditModal(admin)} 
                    className={`px-3 py-1 ${isCurrentUser(admin.id) 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700'} text-white rounded transition-colors flex-1 md:flex-none`}
                    disabled={loading || isCurrentUser(admin.id)}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteAdmin(admin.id)} 
                    className={`px-3 py-1 ${isCurrentUser(admin.id) 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'} text-white rounded transition-colors flex-1 md:flex-none`}
                    disabled={loading || isCurrentUser(admin.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Edit Admin</h2>
            {error && <p className="text-red-500 mb-4 p-2 bg-red-900 bg-opacity-30 rounded">{error}</p>}
            <form onSubmit={handleEditAdmin} className="space-y-3">
              <input 
                type="text" 
                placeholder="First Name" 
                value={editingAdmin.firstName} 
                onChange={(e) => setEditingAdmin({...editingAdmin, firstName: e.target.value})} 
                className="p-2 bg-gray-700 text-white rounded w-full" 
                disabled={loading}
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                value={editingAdmin.lastName} 
                onChange={(e) => setEditingAdmin({...editingAdmin, lastName: e.target.value})} 
                className="p-2 bg-gray-700 text-white rounded w-full" 
                disabled={loading}
              />
              <input 
                type="text" 
                placeholder="Username" 
                value={editingAdmin.username} 
                onChange={(e) => setEditingAdmin({...editingAdmin, username: e.target.value})} 
                className="p-2 bg-gray-700 text-white rounded w-full" 
                disabled={loading}
              />
              <select 
                value={editingAdmin.roleId} 
                onChange={(e) => setEditingAdmin({...editingAdmin, roleId: e.target.value})} 
                className="p-2 bg-gray-700 text-white rounded w-full"
                disabled={loading}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setError("");
                  }} 
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`px-4 py-2 ${loading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded transition-colors`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;