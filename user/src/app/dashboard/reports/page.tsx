import { Construction } from 'lucide-react'

export default function PlaceholderPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4'>
        <div className='bg-indigo-100 p-6 rounded-full dark:bg-indigo-900/20'>
            <Construction size={48} className='text-indigo-600 dark:text-indigo-400' />
        </div>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>Coming Soon</h1>
        <p className='text-gray-500 max-w-md'>
            This feature is currently under development. Stay tuned for updates!
        </p>
    </div>
  )
}
