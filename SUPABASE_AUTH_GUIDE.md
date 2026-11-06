# Supabase Authentication Guide

This project uses Supabase email/password authentication with React, React Router, and a shared auth context.

## 1. Supabase client

[src/lib/supabase.ts](src/lib/supabase.ts) creates the single Supabase client used by the whole app.

The values come from `.env`:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The client file deliberately throws an error when those variables are missing, so configuration problems are easy to find.

These variables are public browser configuration. Never add a Supabase secret service-role key to the Vite project.

## 2. Auth provider

[src/context/AuthContext.tsx](src/context/AuthContext.tsx) stores the current Supabase session.

It provides:

- `session`: the complete Supabase session, including tokens
- `user`: the signed-in user, or `null`
- `loading`: `true` while the initial session is being read
- `signOut()`: signs the user out

`AuthProvider` runs once near the router and calls `supabase.auth.getSession()` to restore an existing login. It also subscribes to `onAuthStateChange`, which updates the app after sign-in, sign-up confirmation, or sign-out.

The `useAuth()` hook reads this context. Components outside `AuthProvider` receive an explanatory error instead of silently using invalid auth state.

## 3. Router integration

[src/App.tsx](src/App.tsx) wraps the whole application in:

```tsx
<BrowserRouter>
  <AuthProvider>
    ...
  </AuthProvider>
</BrowserRouter>
```

The provider must be inside the router only because Supabase auth does not specifically require it here; this also keeps route navigation and auth state together.

The existing routes include:

- `/` - home
- `/auth/sign-in` - sign-in page
- `/auth/sign-up` - sign-up page
- `/profile` - protected profile page
- `/Account/profile` - protected account page

## 4. Sign-in and sign-up page

[src/pages/Auth.tsx](src/pages/Auth.tsx) handles both modes through one dynamic route:

```tsx
<Route path="/auth/:pathname" element={<Auth />} />
```

The component reads `pathname`:

- `pathname === "sign-up"` calls `supabase.auth.signUp()`
- every other pathname currently uses password sign-in

Sign-up can create a session immediately or require email confirmation. If Supabase returns no session after sign-up, the page asks the user to confirm their email.

The sign-up redirect is:

```text
http://localhost:5173/auth/sign-in
```

Add this URL and the production equivalent in the Supabase dashboard under Authentication URL configuration.

## 5. Protected routes

[src/Components/ProtectedRoute.tsx](src/Components/ProtectedRoute.tsx) checks auth state before rendering a page.

While the provider is loading, it displays `Loading...`.

If no user exists, it redirects to `/auth/sign-in` and records the requested page in router state. After login, `Auth.tsx` sends the user back to that page instead of always sending them home.

## 6. The navbar button issue

The custom [src/Components/UI/Button.tsx](src/Components/UI/Button.tsx) button previously had two important problems:

1. It rendered an outer `<div>`, wrapping a real `<button>`. This works visually, but the wrapper makes layout and event behavior harder to predict.
2. It exposed only a `children` prop. The component accepted a label but did not accept ordinary native button props such as `type`, `disabled`, `onClick`, or `className`.

The revised component:

- renders one styled native `<button>`
- extends `ButtonHTMLAttributes<HTMLButtonElement>`
- keeps `type="button"` as the default so clicking it cannot accidentally submit a surrounding form
- forwards props such as `disabled` and `onClick`

Example:

```tsx
<Button>Sign up</Button>

<Button type="submit" disabled={submitting}>
  Create account
</Button>
```

`children` is the visible text or content inside the button. The navbar passes text such as `"Sign in"` or `"Sign up"` as children.

### Why navigation is wrapped around the button

The navbar uses:

```tsx
<Link to="/auth/sign-up">
  <Button>Sign up</Button>
</Link>
```

`Link` performs React Router navigation, while `Button` provides the visible styled button. The button itself should remain `type="button"` in this case because it is not submitting a form.

## 7. Navbar behavior

[src/Components/Layouts/Navbar.tsx](src/Components/Layouts/Navbar.tsx) reads:

```tsx
const { user } = useAuth()
```

When signed out, it shows:

- Sign in
- Sign up

When signed in, it shows:

- Profile
- Account
