'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import UserForm from '@/components/admin/UserForm';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Loader from '@/components/ui/Loader';
import { fetchUsers, updateUser, deleteUser } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const { admin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    if (!authLoading && !admin) { router.push('/admin/login'); return; }
    if (admin) loadUsers();
  }, [admin, authLoading]);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try {
      await updateUser(editingUser._id, data);
      toast.success('User updated successfully');
      setEditingUser(null);
      setShowForm(false);
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (id) => {
    setUserToDelete(id);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUserToDelete(null);
    }
  };

  if (authLoading || !admin) return <Loader />;

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-white font-['Outfit']">Users</h1>
            <p className="text-sm text-neutral-400">{users.length} registered users</p>
          </motion.div>
        </div>

        {loading ? <Loader /> : (
          <div className="overflow-x-auto rounded-2xl border border-neutral-800">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-900 border-b border-neutral-800">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">DOB</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 bg-neutral-900 text-neutral-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, i) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-neutral-400">{user.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-neutral-400">{user.dob ? formatDate(user.dob) : 'N/A'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full ${user.isVerified ? 'bg-[#00c9a7]/10 text-[#00c9a7]' : 'bg-[#ff4757]/10 text-[#ff4757]'}`}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-neutral-400">{formatDate(user.createdAt)}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEditingUser(user); setShowForm(true); }}
                            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
                            title="Edit user"
                          >
                            <IoCreateOutline size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 rounded-lg bg-[#ff4757]/10 hover:bg-[#ff4757]/20 text-[#ff4757] transition-all cursor-pointer"
                            title="Delete user"
                          >
                            <IoTrashOutline size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditingUser(null); }}
          title="Edit User" maxWidth="max-w-2xl">
          <UserForm initialData={editingUser} onSubmit={handleUpdate} loading={formLoading} />
        </Modal>

        <ConfirmModal
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isDanger={true}
        />
      </main>
    </div>
  );
}
