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

export async function getPublicSettings() {
  try {
    const settings = await prisma.setting.findMany()
    
    return {
      zaloPhone: settings.find(s => s.key === 'NEXT_PUBLIC_ZALO_PHONE')?.value || process.env.NEXT_PUBLIC_ZALO_PHONE || '0987654321',
      messengerUrl: settings.find(s => s.key === 'NEXT_PUBLIC_MESSENGER_URL')?.value || process.env.NEXT_PUBLIC_MESSENGER_URL || '',
      shopAddress: settings.find(s => s.key === 'SHOP_ADDRESS')?.value || ''
    }
  } catch (error) {
    console.error('Database connection failed in getPublicSettings, using fallbacks.')
    return {
      zaloPhone: process.env.NEXT_PUBLIC_ZALO_PHONE || '0987654321',
      messengerUrl: process.env.NEXT_PUBLIC_MESSENGER_URL || '',
      shopAddress: ''
    }
  }
}
