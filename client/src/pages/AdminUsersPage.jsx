import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/admin/users')
        setUsers(response.data)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const handleToggleBlock = async (user) => {
    try {
      const url = `/api/admin/users/${user._id}/${user.isBlocked ? 'unblock' : 'block'}`
      const response = await axios.put(url)
      setUsers((prev) => prev.map((item) => (item._id === user._id ? response.data : item)))
      toast.success(`User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <p className="mt-2 text-slate-400">Manage users from the admin dashboard.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-slate-900 p-6 text-center text-slate-400">Loading users…</div>
      ) : users.length === 0 ? (
        <div className="rounded-3xl bg-slate-900 p-6 text-center text-slate-400">No users found.</div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div key={user._id} className="rounded-3xl bg-slate-900 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                  <p className="text-sm text-slate-400">{user.phone || 'No phone provided'}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className={`rounded-full px-3 py-1 text-sm ${user.isBlocked ? 'bg-rose-500 text-slate-950' : 'bg-emerald-500 text-slate-950'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                  <button
                    onClick={() => handleToggleBlock(user)}
                    className="rounded bg-slate-800 px-4 py-2 text-sm text-slate-200"
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
