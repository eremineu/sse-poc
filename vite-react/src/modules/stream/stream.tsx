import { useSSE } from "../../hooks/useSSE";
import type { ModelsMessage } from "../../../Api";
import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";

export const Stream = () => {
	const [tableData, setTableData] = useState<ModelsMessage[]>([]);
	const parentRef = useRef<HTMLDivElement>(null);

	const { data, stop, restart } = useSSE<ModelsMessage[]>(
		"http://localhost:8080/stream",
	);

	const columns = useMemo<Array<ColumnDef<ModelsMessage>>>(
		() => [
			{
				accessorKey: "id",
				header: "ID",
				size: 60,
			},
			{
				accessorKey: "text",
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.user?.email,
				id: "email",
				cell: (info) => info.getValue(),
				header: () => <span>Email</span>,
			},
			{
				accessorKey: "user.username",
				header: () => "Username",
				size: 50,
			},
			{
				accessorKey: "user.nickname",
				header: () => <span>Nickname</span>,
				size: 50,
			},
			{
				accessorKey: "user.id",
				header: "User ID",
			},
			{
				accessorKey: "user.labels",
				header: "User Labels",
				size: 80,
			},
		],
		[],
	);

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: true,
	});

	const { rows } = table.getRowModel();

	const virtualizer = useVirtualizer({
		count: tableData.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 47,
	});

	useEffect(() => {
		if (data) {
			setTableData((prev) => [...data, ...prev]);
		}
	}, [data]);

	const handleStop = () => {
		stop();
	};

	return (
		<>
			<button type="button" onClick={handleStop}>
				Stop
			</button>
			<button type="button" onClick={restart}>
				Restart
			</button>
			<div ref={parentRef} className="h-[500px] overflow-y-auto">
				<div
					style={{
						height: `${virtualizer.getTotalSize()}px`,
						position: "relative",
					}}
				>
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
							{virtualizer.getVirtualItems().map((virtualRow, index) => {
								const row = rows[virtualRow.index];
								return (
									<tr
										key={row.id}
										style={{
											height: `${virtualRow.size}px`,
											transform: `translateY(${
												virtualRow.start - index * virtualRow.size
											}px)`,
										}}
									>
										{row.getVisibleCells().map((cell) => (
											<td key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										))}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};
