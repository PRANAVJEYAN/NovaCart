import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { setUser } from '../store/slices/authSlice'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.auth.user)
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', profileImage: '', addresses: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
  const [newAddress, setNewAddress] = useState({ label: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: '' })

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

  const handleAddAddress = () => {
    setProfile((prev) => ({ ...prev, addresses: [...(prev.addresses || []), newAddress] }))
    setNewAddress({ label: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: '' })
  }

  const handleRemoveAddress = (index) => {
    setProfile((prev) => ({ ...prev, addresses: prev.addresses.filter((_, i) => i !== index) }))
  }

  if (loading) {
    return <div className="rounded-3xl bg-slate-900 p-6 text-center text-slate-400">Loading profile…</div>
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-2 text-slate-400">Manage your personal information, addresses, and security settings.</p>
      </div>

      <section className="rounded-3xl bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-slate-400">Name</span>
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-slate-400">Email</span>
            <input value={profile.email} disabled className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-slate-500" />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-slate-400">Phone</span>
            <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2" />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-slate-400">Profile image URL</span>
            <input value={profile.profileImage} onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })} className="mt-1 w-full rounded border border-slate-800 bg-slate-950 px-3 py-2" />
          </label>
        </div>
        <button onClick={handleSave} disabled={saving} className="mt-6 rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-950">{saving ? 'Saving…' : 'Save personal info'}</button>
      </section>

      <section className="rounded-3xl bg-slate-900 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Address Book</h2>
            <p className="text-slate-400">Add or remove shipping addresses.</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-950">Save addresses</button>
        </div>

        <div className="mt-6 space-y-4">
          {profile.addresses?.length > 0 ? (
            profile.addresses.map((address, index) => (
              <div key={index} className="rounded-3xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{address.label || 'Address ' + (index + 1)}</p>
                  <button onClick={() => handleRemoveAddress(index)} className="text-rose-400">Delete</button>
                </div>
                <p className="text-slate-300">{address.line1}</p>
                {address.line2 && <p className="text-slate-300">{address.line2}</p>}
                <p className="text-slate-300">{address.city}, {address.state} {address.postalCode}</p>
                <p className="text-slate-300">{address.country}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-400">No saved addresses yet.</p>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} placeholder="Label" className="rounded border border-slate-800 bg-slate-950 px-3 py-2" />
          <input value={newAddress.line1} onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} placeholder="Address line 1" className="rounded border border-slate-800 bg-slate-950 px-3 py-2" />
          <input value={newAddress.line2} onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })} placeholder="Address line 2" className="rounded border border-slate-800 bg-slate-950 px-3 py-2" />
          <input value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} placeholder="City" className="rounded border border-slate-800 bg-slate-950 px-3 py-2" />
          <input value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} placeholder="State" className="rounded border border-slate-800 bg-slate-950 px-3 py-2" />
          <input value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} placeholder="Postal code" className="rounded border border-slate-800 bg-slate-950 px-3 py-2" />
          <input value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} placeholder="Country" className="rounded border border-slate-800 bg-slate-950 px-3 py-2" />
        </div>
        <button onClick={handleAddAddress} className="mt-4 rounded bg-slate-700 px-4 py-2 text-sm">Add address</button>
      </section>

      <section className="rounded-3xl bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Security</h2>
        <p className="mt-1 text-slate-400">Update your password to keep your account secure.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="Current password" className="rounded border border-slate-800 bg-slate-950 px-3 py-2" />
          <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="New password" className="rounded border border-slate-800 bg-slate-950 px-3 py-2" />
        </div>
        <button onClick={handlePasswordChange} disabled={passwordSaving} className="mt-4 rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-950">{passwordSaving ? 'Updating…' : 'Change password'}</button>
      </section>

      <section className="rounded-3xl bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Orders</h2>
        <p className="mt-1 text-slate-400">Visit your order history to track delivery status.</p>
        <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-slate-300">Go to your orders page to review purchases and shipment details.</p>
          <a href="/orders" className="mt-4 inline-flex rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">View orders</a>
        </div>
      </section>
    </div>
  )
}
