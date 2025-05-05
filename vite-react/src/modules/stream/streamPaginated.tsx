import type { ModelsMessage, ModelsUser } from "../../../Api";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useUserQuery } from "../../api/userQuery";

const columns: Array<ColumnDef<ModelsUser>> = [
	{ accessorKey: "id", header: "ID", size: 60, maxSize: 60 },
	{
		accessorKey: "text",
		cell: (info) => info.getValue(),
		size: 200,
		maxSize: 200,
	},
	{
		id: "email",
		accessorKey: "email",
		cell: (info) => info.getValue(),
		header: () => <span>Email</span>,
		size: 200,
		maxSize: 200,
	},
	{
		accessorKey: "user.username",
		header: () => "Username",
		size: 50,
		maxSize: 50,
	},
	{
		accessorKey: "user.nickname",
		header: () => <span>Nickname</span>,
		size: 50,
		maxSize: 50,
	},
	{ accessorKey: "user.id", header: "User ID", size: 50, maxSize: 50 },
	{
		accessorKey: "user.labels",
		header: "User Labels",
		size: 80,
		maxSize: 80,
	},
];

export const StreamPaginated = () => {
	const [tableData, setTableData] = useState<ModelsUser[]>([]);
	const parentRef = useRef<HTMLDivElement>(null);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const { data } = useUserQuery();

	useEffect(() => {
		if (data && tableData.length === 0) {
			const mockMessages: ModelsUser[] = Array.from(
				{ length: 100 },
				(_, i) => ({
					id: `${i + 1}`,
					email: `email+${i + 1}@gmail.com`,
					text: `Message ${i + 1}`,
					user: data,
				}),
			);
			setTableData(mockMessages);
		}
	}, [data, tableData.length]);

	const paginatedData = useMemo(() => {
		const start = pagination.pageIndex * pagination.pageSize;
		const end = start + pagination.pageSize;
		return tableData.slice(start, end);
	}, [tableData, pagination]);

	const totalPages = Math.ceil(tableData.length / pagination.pageSize);

	const table = useReactTable({
		data: paginatedData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: true,
		pageCount: totalPages,
		manualPagination: true,
		onPaginationChange: setPagination,
		state: {
			pagination,
		},
	});

	const { rows } = table.getRowModel();

	return (
		<div className="container mx-auto">
			<div ref={parentRef} className="h-auto overflow-y-auto">
				<table className="table w-full">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id}>
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
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

			<div className="flex gap-2 mt-4 justify-center">
				<div className="join">
					{Array.from({ length: totalPages }).map((_, index) => (
						<input
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							className="join-item btn btn-square"
							type="radio"
							name="page"
							aria-label={`${index + 1}`}
							checked={pagination.pageIndex === index}
							onChange={() => {
								table.setPageIndex(index);
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
