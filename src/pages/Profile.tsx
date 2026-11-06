import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-2xl px-6 pt-28">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-4">{user?.email}</p>
    </div>
  )
}