import type { ColumnDef } from '@tanstack/react-table'
import type { ModelsUser } from '../../../Api'

export const paginationColumns: Array<ColumnDef<ModelsUser>> = [
  { accessorKey: 'id', header: 'ID', size: 60, maxSize: 60 },
  {
    accessorKey: 'text',
    cell: (info) => info.getValue(),
    size: 200,
    maxSize: 200
  },
  {
    id: 'email',
    accessorKey: 'email',
    cell: (info) => info.getValue(),
    header: () => <span>Email</span>,
    size: 200,
    maxSize: 200
  },
  {
    accessorKey: 'user.username',
    header: () => 'Username',
    size: 50,
    maxSize: 50
  },
  {
    accessorKey: 'user.nickname',
    header: () => <span>Nickname</span>,
    size: 50,
    maxSize: 50
  },
  { accessorKey: 'user.id', header: 'User ID', size: 50, maxSize: 50 },
  {
    accessorKey: 'user.labels',
    header: 'User Labels',
    size: 80,
    maxSize: 80
  }
]
