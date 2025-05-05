import { createFileRoute } from "@tanstack/react-router";
import { StreamPaginated } from "../modules/stream/streamPaginated";

export const Route = createFileRoute("/about")({
	component: StreamPaginated,
});
