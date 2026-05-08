import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const email = process.env.ADMIN_EMAIL || 'admin@example.com'
const password = process.env.ADMIN_PASSWORD

if (!password) {
  console.error('Error: ADMIN_PASSWORD environment variable is required')
  console.error('Usage: ADMIN_PASSWORD=your-password node scripts/create-admin.js')
  process.exit(1)
}

async function main() {
  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    console.log(`Admin user '${email}' already exists (id: ${existing.id})`)
    return
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.adminUser.create({
    data: { email, password: hashedPassword },
  })

  console.log(`Admin user created:`)
  console.log(`  id:    ${user.id}`)
  console.log(`  email: ${user.email}`)
}

main()
  .catch((err) => {
    console.error('Failed to create admin user:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
