import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { setUser } from '../store/slices/authSlice'

export default function AdminProfilePage() {
  const dispatch = useDispatch()
  const [profile, setProfile] = useState({ name: '', email: '', role: 'admin', profileImage: '', lastLogin: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get('/api/auth/profile')
        setProfile(response.data)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Unable to load profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await axios.put('/api/auth/profile', profile)
      setProfile(response.data)
      dispatch(setUser(response.data))
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordSaving(true)
    try {
      await axios.put('/api/auth/change-password', passwordForm)
      setPasswordForm({ currentPassword: '', newPassword: '' })
      toast.success('Password updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to change password')
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) {
    return <div className="rounded-3xl bg-slate-900 p-6 text-center text-slate-400">Loading admin profile…</div>
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <p className="mt-2 text-slate-400">Review your account details and security settings.</p>
      </div>

      <section className="rounded-3xl bg-slate-900 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-slate-400">Name</p>
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2" />
          </div>
          <div>
            <p className="text-slate-400">Email</p>
            <input value={profile.email} disabled className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-slate-500" />
          </div>
          <div>
            <p className="text-slate-400">Role</p>
            <input value={profile.role} disabled className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-slate-500" />
          </div>
          <div>
            <p className="text-slate-400">Last login</p>
            <input value={profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : ''} disabled className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-slate-500" />
          </div>
          <div className="sm:col-span-2">
            <p className="text-slate-400">Profile image URL</p>
            <input value={profile.profileImage} onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2" />
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="mt-6 rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-950">{saving ? 'Saving…' : 'Save admin info'}</button>
      </section>

      <section className="rounded-3xl bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="Current password" className="rounded border border-slate-800 bg-slate-950 px-3 py-2" />
          <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="New password" className="rounded border border-slate-800 bg-slate-950 px-3 py-2" />
        </div>
        <button onClick={handlePasswordChange} disabled={passwordSaving} className="mt-4 rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-950">{passwordSaving ? 'Updating…' : 'Update password'}</button>
      </section>
    </div>
  )
}
