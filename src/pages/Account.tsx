import { useAuth } from '../context/AuthContext'

export default function Account() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pt-28">
      <h1 className="text-2xl font-semibold">Account</h1>
      <p className="mt-4">{user?.email}</p>
      <button
        className="mt-6 rounded bg-green-600 px-4 py-2 text-white"
        onClick={handleSignOut}
      >
        Sign out
      </button>
    </div>
  )
}