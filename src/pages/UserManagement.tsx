import { useState, useEffect } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { User } from '../types';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'shopkeeper'
  });

  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map(u =>
        u.id === editingUser.id
          ? {
              ...u,
              username: formData.username,
              name: formData.name,
              role: formData.role as User['role'],
              ...(formData.password ? { password: formData.password } : {})
            }
          : u
      );
      saveUsers(updatedUsers);
      setEditingUser(null);
    } else {
      // Add new user
      const newUser: User = {
        id: crypto.randomUUID(),
        username: formData.username,
        password: formData.password,
        name: formData.name,
        role: formData.role as User['role']
      };
      saveUsers([...users, newUser]);
    }
    setFormData({ username: '', password: '', name: '', role: 'shopkeeper' });
    setIsAddingNew(false);
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      name: user.name,
      role: user.role
    });
    setIsAddingNew(false);
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(u => u.id !== id);
    saveUsers(updatedUsers);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-900">User Management</h1>
        <button
          onClick={() => {
            setIsAddingNew(true);
            setEditingUser(null);
            setFormData({ username: '', password: '', name: '', role: 'shopkeeper' });
          }}
          className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Add New User</span>
        </button>
      </div>

      {(isAddingNew || editingUser) && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white/50 backdrop-blur-xl rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...(!editingUser && { required: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="owner">Owner</option>
                <option value="store_manager">Store Manager</option>
                <option value="shopkeeper">Shopkeeper</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {editingUser ? 'Update' : 'Add'} User
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setEditingUser(null);
                setFormData({ username: '', password: '', name: '', role: 'shopkeeper' });
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white/50 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-emerald-600 text-white">
              <th className="px-6 py-3 text-left">Username</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-white/20">
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4 capitalize">{user.role.replace('_', ' ')}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => startEdit(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
