import { createFileRoute } from '@tanstack/react-router'
import { Pagination } from '../modules/user/pagination'

export const Route = createFileRoute('/about')({
  component: Pagination
})
