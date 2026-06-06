export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import SignaturePad from '@/components/invoice/SignaturePad'
import InvoicingNav from './InvoicingNav'

export default async function InvoicingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="min-h-full bg-amber-50">
      <InvoicingNav />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
