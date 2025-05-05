import { useState, useEffect, useRef, useCallback } from "react";

export function useSSE<T>(url: string, maxRetries = 3, retryDelay = 3_000) {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<Event | null>(null);
	const [status, setStatus] = useState<
		"connecting" | "connected" | "disconnected"
	>("disconnected");
	const esRef = useRef<EventSource>(null);
	const tries = useRef(0);

	const connect = useCallback(() => {
		esRef.current?.close();
		setStatus("connecting");
		const es = new EventSource(url);
		esRef.current = es;

		es.onmessage = (e) => {
			try {
				setData(JSON.parse(e.data));
				tries.current = 0;
				setError(null);
				setStatus("connected");
			} catch {
				/* ignore parse errors */
			}
		};

		es.onopen = () => {
			setStatus("connected");
		};

		es.onerror = (e) => {
			setError(e);
			setStatus("disconnected");
			es.close();
			if (tries.current++ < maxRetries) {
				console.log("Retrying connection...");
				setTimeout(connect, retryDelay);
			}
		};
	}, [url, maxRetries, retryDelay]);

	useEffect(() => {
		connect();
		return () => {
			esRef.current?.close();
			setStatus("disconnected");
		};
	}, [connect]);

	const stop = useCallback(() => {
		esRef.current?.close();
		setStatus("disconnected");
	}, []);

	const restart = useCallback(() => {
		tries.current = 0;
		setData(null);
		setError(null);
		connect();
	}, [connect]);

	return { data, error, status, stop, restart };
}
