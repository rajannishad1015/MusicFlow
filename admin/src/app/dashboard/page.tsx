import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome, {user.email}</p>
      
      {/* Stats Cards Placeholder */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-sm font-medium text-gray-500">Total Uploads</h3>
            <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
            <p className="text-2xl font-bold">0</p>
        </div>
         <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-sm font-medium text-gray-500">Active Artists</h3>
            <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  )
}
