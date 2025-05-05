import { useState, useEffect, useRef, useCallback } from "react";

export function useSSE<T>(url: string, maxRetries = 3, retryDelay = 3_000) {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<Event | null>(null);
	const esRef = useRef<EventSource>(null);
	const tries = useRef(0);

	const connect = useCallback(() => {
		esRef.current?.close();
		const es = new EventSource(url);
		esRef.current = es;

		es.onmessage = (e) => {
			try {
				setData(JSON.parse(e.data));
				tries.current = 0;
				setError(null);
			} catch {
				/* ignore parse errors */
			}
		};

		es.onerror = (e) => {
			setError(e);
			es.close();
			if (tries.current++ < maxRetries) {
				console.log("Retrying connection...");
				setTimeout(connect, retryDelay);
			}
		};
	}, [url, maxRetries, retryDelay]);

	useEffect(() => {
		connect();
		return () => esRef.current?.close();
	}, [connect]);

	const stop = useCallback(() => {
		esRef.current?.close();
	}, []);

	const restart = useCallback(() => {
		tries.current = 0;
		setData(null);
		setError(null);
		connect();
	}, [connect]);

	return { data, error, stop, restart };
}
