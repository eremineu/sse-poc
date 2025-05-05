import { createFileRoute } from '@tanstack/react-router'
import { User } from '../modules/user/user'

export const Route = createFileRoute('/main')({
  component: User
})
