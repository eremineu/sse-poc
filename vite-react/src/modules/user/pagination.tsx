import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ModelsUser } from '../../../Api'
import { useUserQuery } from '../../api/userQuery'
import { paginationColumns } from './paginationColumns'

export const Pagination = () => {
  const [tableData, setTableData] = useState<ModelsUser[]>([])
  const parentRef = useRef<HTMLDivElement>(null)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const { data } = useUserQuery()

  useEffect(() => {
    if (data && tableData.length === 0) {
      const mockMessages: ModelsUser[] = Array.from(
        { length: 100 },
        (_, i) => ({
          id: `${i + 1}`,
          email: `email+${i + 1}@gmail.com`,
          text: `Message ${i + 1}`,
          user: data
        })
      )
      setTableData(mockMessages)
    }
  }, [data, tableData.length])

  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    const end = start + pagination.pageSize
    return tableData.slice(start, end)
  }, [tableData, pagination])

  const totalPages = Math.ceil(tableData.length / pagination.pageSize)

  const table = useReactTable({
    data: paginatedData,
    columns: paginationColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    pageCount: totalPages,
    manualPagination: true,
    onPaginationChange: setPagination,
    state: {
      pagination
    }
  })

  const { rows } = table.getRowModel()

  return (
    <div className='container mx-auto'>
      <div ref={parentRef} className='h-auto overflow-y-auto'>
        <table className='table w-full'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex gap-2 mt-4 justify-center'>
        <div className='join'>
          {Array.from({ length: totalPages }).map((_, index) => (
            <input
              key={index}
              className='join-item btn btn-square'
              type='radio'
              name='page'
              aria-label={`${index + 1}`}
              checked={pagination.pageIndex === index}
              onChange={() => {
                table.setPageIndex(index)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
