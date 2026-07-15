import { login } from './actions'
import LoginSubmitButton from '@/components/admin/LoginSubmitButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft-gray p-4">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif text-dark mb-2">Đăng Nhập</h1>
          <p className="text-gray-500 text-sm">Hệ thống quản trị DanyDecor CMS</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <form action={login} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-dark mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-soft-gray border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="admin@danydecor.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-dark mb-2" htmlFor="password">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-soft-gray border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
            />
          </div>
          <LoginSubmitButton />
        </form>
      </div>
    </div>
  )
}
