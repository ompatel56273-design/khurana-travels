'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import PackageForm from '@/components/admin/PackageForm';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Loader from '@/components/ui/Loader';
import { fetchAllPackages, createPackage, updatePackage, deletePackage } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { IoAddCircleOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

export default function AdminPackagesPage() {
  const { admin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [pkgToDelete, setPkgToDelete] = useState(null);

  useEffect(() => {
    if (!authLoading && !admin) { router.push('/admin/login'); return; }
    if (admin) loadPackages();
  }, [admin, authLoading]);

  const loadPackages = async () => {
    try { const data = await fetchAllPackages(); setPackages(data); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const handleCreate = async (data) => {
    setFormLoading(true);
    try { await createPackage(data); toast.success('Package created'); setShowForm(false); loadPackages(); }
    catch (err) { toast.error(err.message); }
    finally { setFormLoading(false); }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try { await updatePackage(editingPkg._id, data); toast.success('Package updated'); setEditingPkg(null); loadPackages(); }
    catch (err) { toast.error(err.message); }
    finally { setFormLoading(false); }
  };

  const handleDelete = (id) => {
    setPkgToDelete(id);
  };

  const confirmDelete = async () => {
    if (!pkgToDelete) return;
    try { await deletePackage(pkgToDelete); toast.success('Deleted'); loadPackages(); }
    catch (err) { toast.error(err.message); }
    finally { setPkgToDelete(null); }
  };

  if (authLoading || !admin) return <Loader />;

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-white font-['Outfit']">Packages</h1>
            <p className="text-sm text-neutral-400">{packages.length} total packages</p>
          </motion.div>
          <Button onClick={() => { setEditingPkg(null); setShowForm(true); }}>
            <IoAddCircleOutline size={18} /> New Package
          </Button>
        </div>

        {loading ? <Loader /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg, i) => (
              <motion.div key={pkg._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-white font-['Outfit']">{pkg.title}</h3>
                  <span className={`text-[10px] px-2 py-1 rounded-full ${pkg.isActive ? 'bg-[#00c9a7]/10 text-[#00c9a7]' : 'bg-[#ff4757]/10 text-[#ff4757]'}`}>
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mb-2">{pkg.route.join(' → ')}</p>
                <div className="flex items-center gap-3 text-xs text-neutral-400 mb-4">
                  <span>{pkg.duration}</span>
                  <span>•</span>
                  <span>{pkg.busType}</span>
                  <span>•</span>
                  <span className="text-[#f5a623] font-semibold">{formatCurrency(pkg.price)}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingPkg(pkg); setShowForm(true); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-neutral-800 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all cursor-pointer">
                    <IoCreateOutline size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(pkg._id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#ff4757]/10 rounded-lg text-xs text-[#ff4757] hover:bg-[#ff4757]/20 transition-all cursor-pointer">
                    <IoTrashOutline size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditingPkg(null); }}
          title={editingPkg ? 'Edit Package' : 'New Package'} maxWidth="max-w-2xl">
          <PackageForm initialData={editingPkg} onSubmit={editingPkg ? handleUpdate : handleCreate} loading={formLoading} />
        </Modal>

        <ConfirmModal
          isOpen={!!pkgToDelete}
          onClose={() => setPkgToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Package"
          message="Are you sure you want to delete this package? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isDanger={true}
        />
      </main>
    </div>
  );
}
