import { cache } from "react"
import prisma from "./prisma"

export async function getSetting(key: string, defaultValue: string = '') {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key }
    })
    return setting?.value || defaultValue
  } catch (error) {
    return defaultValue
  }
}

export const getPublicSettings = cache(async () => {
  try {
    const settings = await prisma.setting.findMany()
    
    return {
      zaloPhone: settings.find(s => s.key === 'NEXT_PUBLIC_ZALO_PHONE')?.value || process.env.NEXT_PUBLIC_ZALO_PHONE || '0987654321',
      hotlinePhone: settings.find(s => s.key === 'HOTLINE_PHONE')?.value || process.env.HOTLINE_PHONE || '0987654321',
      messengerUrl: settings.find(s => s.key === 'NEXT_PUBLIC_MESSENGER_URL')?.value || process.env.NEXT_PUBLIC_MESSENGER_URL || '',
      shopAddress: settings.find(s => s.key === 'SHOP_ADDRESS')?.value || '',
      highlight1Text: settings.find(s => s.key === 'HIGHLIGHT_1_TEXT')?.value || 'Bảo hành 2 năm',
      highlight2Text: settings.find(s => s.key === 'HIGHLIGHT_2_TEXT')?.value || 'Giao nhanh 2h'
    }
  } catch (error) {
    console.error('Database connection failed in getPublicSettings, using fallbacks.')
    return {
      zaloPhone: process.env.NEXT_PUBLIC_ZALO_PHONE || '0987654321',
      hotlinePhone: process.env.HOTLINE_PHONE || '0987654321',
      messengerUrl: process.env.NEXT_PUBLIC_MESSENGER_URL || '',
      shopAddress: '',
      highlight1Text: 'Bảo hành 2 năm',
      highlight2Text: 'Giao nhanh 2h'
    }
  }
});
