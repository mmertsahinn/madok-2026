import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('workshops')
      .select('id, isim, aciklama, tarih, sure, kontenjan, kayitli_sayisi, fiyat')
      .eq('is_published', true)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[workshop/GET] DB error:', error)
      return NextResponse.json({ error: 'Workshoplar yüklenemedi.' }, { status: 500 })
    }

    return NextResponse.json({ workshops: data ?? [] })
  } catch (err) {
    console.error('[workshop/GET] Hata:', err)
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 })
  }
}
