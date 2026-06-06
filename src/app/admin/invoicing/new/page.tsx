import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import DocumentCreator from '@/components/invoice/DocumentCreator'

export default async function NewDocumentPage() {
  const supabase = await createClient()

  const [{ data: items }, { data: clients }] = await Promise.all([
    supabase.from('items').select('*').order('name'),
    supabase.from('clients').select('name').order('name'),
  ])

  return (
    <Suspense>
      <DocumentCreator
        items={items ?? []}
        existingClients={(clients ?? []).map((c: { name: string }) => c.name)}
      />
    </Suspense>
  )
}
