import { createClient } from '@/lib/supabase/server'
import ItemsManager from '@/components/invoice/ItemsManager'

export default async function InvoiceItemsPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('items').select('*').order('name')

  return <ItemsManager initialItems={items ?? []} />
}
