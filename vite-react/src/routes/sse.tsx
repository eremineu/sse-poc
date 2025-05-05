import { createFileRoute } from "@tanstack/react-router";
import { Stream } from "../modules/stream/stream";

export const Route = createFileRoute("/sse")({
	component: Stream,
});
