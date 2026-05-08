import prisma from "@/lib/prisma"

export default async function Page() {
  const keys = Object.keys(prisma);
  const settingExists = 'setting' in prisma;
  
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Prisma Debug</h1>
      <p>Keys: {keys.join(', ')}</p>
      <p>Setting exists: {settingExists ? 'Yes' : 'No'}</p>
    </div>
  );
}
