'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Clock, Package, PenLine, ArrowLeft, ReceiptText } from 'lucide-react'
import SignaturePad from '@/components/invoice/SignaturePad'

const navLinks = [
  { href: '/admin/invoicing', label: 'Home', icon: Home },
  { href: '/admin/invoicing/records', label: 'Payment Records', icon: ReceiptText },
  { href: '/admin/invoicing/history', label: 'Documents', icon: Clock },
  { href: '/admin/invoicing/items', label: 'Items', icon: Package },
]

export default function InvoicingNav() {
  const pathname = usePathname()
  const [showSignature, setShowSignature] = useState(false)

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:block">Back to Admin</span>
            </Link>
            <div className="w-px h-5 bg-gray-200" />
            <Link href="/admin/invoicing" className="flex items-center gap-2">
              <div className="w-7 h-7 relative">
                <Image src="/bristeen-logo.png" alt="Bristeen" fill className="object-contain" />
              </div>
              <span className="font-bold text-gray-800 text-sm hidden sm:block">Invoicing</span>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  pathname === href
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </Link>
            ))}
            <button
              onClick={() => setShowSignature(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition"
              title="Manage signature"
            >
              <PenLine className="w-4 h-4" />
              <span className="hidden sm:block">Signature</span>
            </button>
          </div>
        </div>
      </nav>

      {showSignature && <SignaturePad onClose={() => setShowSignature(false)} />}
    </>
  )
}
