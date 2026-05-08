'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateSettings(formData: FormData) {
  const zaloPhone = formData.get('zalo_phone') as string
  const messengerUrl = formData.get('messenger_url') as string
  const shopAddress = formData.get('shop_address') as string

  try {
    const settings = [
      { key: 'NEXT_PUBLIC_ZALO_PHONE', value: zaloPhone },
      { key: 'NEXT_PUBLIC_MESSENGER_URL', value: messengerUrl },
      { key: 'SHOP_ADDRESS', value: shopAddress }
    ]

    for (const setting of settings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value }
      })
    }

    revalidatePath('/admin/settings')
    revalidatePath('/', 'layout')
    
    return { success: true }
  } catch (error) {
    console.error('Failed to update settings:', error)
    return { success: false, error: 'Không thể lưu cấu hình' }
  }
}
