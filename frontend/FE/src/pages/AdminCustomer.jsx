import { useState, useEffect } from 'react';
import { User, Mail, Shield, Search, Plus, Trash2, ShieldCheck, ShieldAlert, X, ShieldOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminCustomer = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState(0);

    const loadUsers = () => {
        const storedUsers = JSON.parse(localStorage.getItem('usersDb') || '[]');
        setUsers(storedUsers);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const saveUsers = (newUsers) => {
        localStorage.setItem('usersDb', JSON.stringify(newUsers));
        setUsers(newUsers);
    };

    const handleToggleRole = (email) => {
        if (email === 'admin@gmail.com') {
            toast.error("Không thể thay đổi quyền của Admin mặc định!");
            return;
        }
        const updated = users.map(u => {
            if (u.email === email) {
                return { ...u, role: u.role === 1 ? 0 : 1 };
            }
            return u;
        });
        saveUsers(updated);
        toast.success("Đã cập nhật phân quyền!");
    };

    const handleDelete = (email) => {
        if (email === 'admin@gmail.com') {
            toast.error("Không thể xóa Admin mặc định!");
            return;
        }
        if(window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${email}?`)) {
            const updated = users.filter(u => u.email !== email);
            saveUsers(updated);
            toast.success("Đã xóa tài khoản thành công!");
        }
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        if(!newName || !newEmail || !newPassword) {
            toast.error("Vui lòng điền đủ thông tin!");
            return;
        }
        if(users.some(u => u.email === newEmail)) {
            toast.error("Email này đã tồn tại!");
            return;
        }
        const newUser = { name: newName, email: newEmail, password: newPassword, role: newRole };
        saveUsers([newUser, ...users]);
        toast.success("Đã thêm tài khoản mới!");
        setShowAddModal(false);
        setNewName(''); setNewEmail(''); setNewPassword(''); setNewRole(0);
    };

    const filtered = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen pt-12 pb-40 px-6">
            <div className="container mx-auto max-w-7xl">
                <header className="mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                    <div>
                        <span className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">User Accounts</span>
                        <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 italic">Quản lý Người dùng</h1>
                    </div>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-gray-900 text-white px-8 py-4 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-orange-500 transition-all flex items-center gap-3 shadow-xl"
                    >
                        <Plus size={18} /> Thêm tài khoản
                    </button>
                </header>

                <div className="bg-white p-4 rounded-[2rem] shadow-sm mb-12 flex items-center gap-4 px-8 border border-gray-100">
                    <Search className="text-gray-300" size={20} />
                    <input 
                        type="text" 
                        placeholder="Tìm khách hàng theo tên hoặc email..." 
                        className="flex-1 bg-transparent outline-none font-bold text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                                    <th className="p-8">Khách hàng</th>
                                    <th className="p-8">Email liên hệ</th>
                                    <th className="p-8">Vai trò</th>
                                    <th className="p-8 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((u, idx) => (
                                    <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-2xl shadow-lg text-white ${u.role === 1 ? 'bg-black' : 'bg-orange-500'}`}>
                                                    {u.role === 1 ? <Shield size={18} /> : <User size={18} />}
                                                </div>
                                                <span className="font-black text-gray-900 text-lg uppercase tracking-tight">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-2 text-gray-500 font-medium italic">
                                                <Mail size={14} />
                                                {u.email}
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                {u.role === 1 ? 'Quản trị viên' : 'Khách hàng'}
                                            </span>
                                        </td>
                                        <td className="p-8 text-right">
                                            {u.email === 'admin@gmail.com' ? (
                                                <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-xl inline-flex gap-2">
                                                    <Shield size={14} className="text-gray-400" /> Vĩnh viễn
                                                </span>
                                            ) : (
                                                <div className="flex items-center justify-end gap-3">
                                                    <button 
                                                        onClick={() => handleToggleRole(u.email)}
                                                        title={u.role === 1 ? "Gỡ quyền Admin" : "Cấp quyền Admin"}
                                                        className={`p-2 rounded-xl transition-all ${u.role === 1 ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-gray-100 text-gray-600 hover:bg-black hover:text-white'}`}
                                                    >
                                                        {u.role === 1 ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(u.email)}
                                                        title="Xóa tài khoản"
                                                        className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Thêm User */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full relative shadow-2xl">
                            <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors">
                                <X size={24} />
                            </button>
                            <h2 className="text-3xl font-serif font-black italic text-gray-900 mb-8">Thêm tài khoản</h2>
                            
                            <form onSubmit={handleAddUser} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-6 block mb-2">Tên hiển thị</label>
                                    <input 
                                        type="text" 
                                        value={newName} onChange={e => setNewName(e.target.value)} required
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-100 px-8 py-4 rounded-[1.5rem] outline-none font-bold transition-all"
                                        placeholder="Nguyễn Văn A" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-6 block mb-2">Email đăng nhập</label>
                                    <input 
                                        type="email" 
                                        value={newEmail} onChange={e => setNewEmail(e.target.value)} required
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-100 px-8 py-4 rounded-[1.5rem] outline-none font-bold transition-all"
                                        placeholder="email@example.com" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-6 block mb-2">Mật khẩu</label>
                                    <input 
                                        type="password" 
                                        value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-100 px-8 py-4 rounded-[1.5rem] outline-none font-bold transition-all"
                                        placeholder="••••••••" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-6 block mb-2">Phân quyền</label>
                                    <select 
                                        value={newRole} onChange={e => setNewRole(Number(e.target.value))}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-100 px-8 py-4 rounded-[1.5rem] outline-none font-bold transition-all appearance-none cursor-pointer"
                                    >
                                        <option value={0}>Khách hàng (User)</option>
                                        <option value={1}>Quản trị viên (Admin)</option>
                                    </select>
                                </div>
                                
                                <button type="submit" className="w-full bg-orange-500 text-white rounded-[1.5rem] py-5 font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl mt-4">
                                    Hoàn tất thêm
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCustomer;

