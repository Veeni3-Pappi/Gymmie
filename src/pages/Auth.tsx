import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const { pathname } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const isSignUp = pathname === 'sign-up'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  if (!loading && user) {
    const from = (location.state as { from?: string } | null)?.from ?? '/'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { 
    event.preventDefault()
    setSubmitting(true)
    setMessage('')

    const result = isSignUp
      ? await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/sign-in` },
        })
      : await supabase.auth.signInWithPassword({ email, password })

    if (result.error) {
      setMessage(result.error.message)
    } else if (isSignUp && !result.data.session) {
      setMessage('Check your email to confirm your account.')
    } else {
      const from = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(from, { replace: true })
    }

    setSubmitting(false)
  }

  return (
    <div className="mx-auto max-w-md px-6 pt-28">
      <h1 className="text-2xl font-semibold">{isSignUp ? 'Create account' : 'Sign in'}</h1>
      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            className="mt-1 block w-full rounded border px-3 py-2"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            className="mt-1 block w-full rounded border px-3 py-2"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </label>
        <button className="rounded bg-green-600 px-4 py-2 text-white" disabled={submitting}>
          {submitting ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
        </button>
      </form>
      {message && <p className="mt-4" role="alert">{message}</p>}
      <p className="mt-6">
        {isSignUp ? (
          <>Already have an account? <Link to="/auth/sign-in">Sign in</Link></>
        ) : (
          <>Need an account? <Link to="/auth/sign-up">Create one</Link></>
        )}
      </p>
    </div>
  )
}