import { useSSE } from "../../hooks/useSSE";
import type { ModelsMessage } from "../../../Api";
import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { streamColumns } from "./streamColumns";

export const Stream = () => {
	const [tableData, setTableData] = useState<ModelsMessage[]>([]);
	const parentRef = useRef<HTMLDivElement>(null);

	const { data, stop, restart, status } = useSSE<ModelsMessage[]>(
		"http://localhost:8080/stream",
	);

	const table = useReactTable({
		data: tableData,
		columns: streamColumns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: true,
		enableColumnResizing: true,
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
		<div className="container mx-auto">
			<div ref={parentRef} className="h-[800px] overflow-y-auto">
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
			<div className="flex gap-2 mt-4">
				<button type="button" className="btn btn-outline" onClick={handleStop}>
					Stop
				</button>
				<button type="button" className="btn btn-outline" onClick={restart}>
					Restart
				</button>
				<span className="text-sm">{status}</span>
			</div>
		</div>
	);
};
