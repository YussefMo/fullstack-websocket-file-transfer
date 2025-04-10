'use client';

import type React from 'react';

import { FileCard } from '@/components/file-card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WifiAnimation } from '@/components/wifi-animation';
import { generateId } from '@/lib/utils';
import {
  ArrowLeft,
  CheckIcon,
  CopyIcon,
  FileIcon,
  LinkIcon,
  Loader2Icon,
  SendIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function SendPage() {
	const [file, setFile] = useState<File | null>(null);
	const [fileSending, setFileSending] = useState(false);
	const [transferId, setTransferId] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [transferProgress, setTransferProgress] = useState(0);
	const [isGeneratingLink, setIsGeneratingLink] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const wsRef = useRef<WebSocket | null>(null);
	const recipientIdRef = useRef<string | null>(null);
	const reconnectAttemptsRef = useRef(0);
	const MAX_RECONNECT_ATTEMPTS = 5;
	const RECONNECT_DELAY = 3000;

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			setFile(e.dataTransfer.files[0]);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const connectWebSocket = () => {
		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
			return wsRef.current;
		}

		const ws = new WebSocket(`ws://${window.location.hostname}:8000/ws`);
		wsRef.current = ws;

		ws.onopen = () => {
			reconnectAttemptsRef.current = 0;
			const connectionId = generateId(8);
			setTransferId(connectionId);
			setIsGeneratingLink(false);

			ws.send(
				JSON.stringify({
					type: 'register',
					connectionId: connectionId,
				})
			);
		};

		ws.onmessage = (event) => {
			if (typeof event.data === 'string') {
				const data = JSON.parse(event.data);
				if (data.type === 'receiver-ready') {
					recipientIdRef.current = data.senderId;
					setIsConnected(true);
				} else if (data.type === 'transfer-complete') {
					setTransferProgress(100);
				}
			}
		};

		ws.onerror = (err) => {
			setIsGeneratingLink(false);
		};

		ws.onclose = () => {
			setIsConnected(false);

			if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
				reconnectAttemptsRef.current++;
				setTimeout(connectWebSocket, RECONNECT_DELAY);
			}
		};

		return ws;
	};

	const generateReceiverLink = async () => {
		if (!file) return;

		setIsGeneratingLink(true);

		try {
			connectWebSocket();
		} catch (error) {
			setIsGeneratingLink(false);
		}
	};

	const copyLink = () => {
		if (!transferId) return;

		const link = `${window.location.origin}/receive?id=${transferId}`;

		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard
				.writeText(link)
				.then(() => {
					setCopied(true);
					setTimeout(() => setCopied(false), 2000);
				})
				.catch((err) => {
					console.error('Clipboard copy failed:', err);
				});
		} else {
			// Fallback for older browsers
			const textArea = document.createElement('textarea');
			textArea.value = link;
			textArea.style.position = 'absolute';
			textArea.style.opacity = '0';
			document.body.appendChild(textArea);
			textArea.select();
			try {
				document.execCommand('copy');
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} catch (err) {
				console.error('Fallback copy failed:', err);
				alert('Failed to copy. Try manually selecting and copying the text.');
			}
			document.body.removeChild(textArea);
		}
	};

	const sendFile = () => {
		if (!file || !wsRef.current || !recipientIdRef.current) return;
		setFileSending(true);
		// const CHUNK_SIZE = 65536 // 64KB chunks
		const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
		let offset = 0;
		let chunkCount = 0;

		wsRef.current.send(
			JSON.stringify({
				target_id: recipientIdRef.current,
				type: 'file-info',
				name: file.name,
				size: file.size,
				mimeType: file.type || 'application/octet-stream',
			})
		);

		const reader = new FileReader();

		reader.onload = (e) => {
			if (!e.target?.result) return;

			const chunkData = new Uint8Array(e.target.result as ArrayBuffer);

			const message = {
				target_id: recipientIdRef.current,
				type: 'file-chunk',
				chunkNumber: chunkCount,
			};

			wsRef.current?.send(JSON.stringify(message));
			wsRef.current?.send(chunkData);

			offset += chunkData.length;
			chunkCount++;

			const progress = Math.min(100, Math.floor((offset / file.size) * 100));
			setTransferProgress(progress);

			if (offset < file.size) {
				setTimeout(() => {
					const slice = file.slice(offset, offset + CHUNK_SIZE);
					reader.readAsArrayBuffer(slice);
				}, 0);
			} else {
				wsRef.current?.send(
					JSON.stringify({
						target_id: recipientIdRef.current,
						type: 'file-end',
						chunkCount: chunkCount,
					})
				);
        setFileSending(false);
			}
		};

		reader.onerror = (e) => {
			setFileSending(false);
		};

		// Start reading the first chunk
		const slice = file.slice(offset, offset + CHUNK_SIZE);
		reader.readAsArrayBuffer(slice);
	};

	// Clean up WebSocket connection on unmount
	useEffect(() => {
		return () => {
			if (wsRef.current) {
				wsRef.current.close();
			}
		};
	}, []);

	return (
		<div className='min-h-screen flex flex-col gradient-bg'>
			{/* Header */}
			<header className='container flex items-center justify-between p-4'>
				<Link href='/'>
					<Button
						variant='ghost'
						size='icon'
						className='rounded-full hover:bg-secondary/80'
					>
						<ArrowLeft className='h-5 w-5' />
						<span className='sr-only'>Back</span>
					</Button>
				</Link>
				<ThemeToggle />
			</header>

			{/* Main content */}
			<main className='flex-1 container flex flex-col items-center justify-center py-8 max-w-md'>
				<div className='w-full space-y-8'>
					{!file && (
						<>
							<div className='text-center space-y-3'>
								<h1 className='text-3xl font-bold'>Send a File</h1>
								<p className='text-muted-foreground'>
									Select a file to share it securely via WebSocket
								</p>
							</div>

							<div
								className='w-full border-2 border-dashed border-border/50 rounded-xl p-10 text-center cursor-pointer hover:bg-secondary/50 transition-all group'
								onClick={() => fileInputRef.current?.click()}
								onDrop={handleDrop}
								onDragOver={handleDragOver}
							>
								<Input
									type='file'
									ref={fileInputRef}
									onChange={handleFileSelect}
									className='hidden'
								/>
								<div className='w-16 h-16 mx-auto rounded-xl bg-secondary/80 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform'>
									<FileIcon className='h-7 w-7' />
								</div>
								<p className='text-base font-medium mb-1'>
									Drag and drop your file here
								</p>
								<p className='text-sm text-muted-foreground'>
									or click to browse
								</p>
							</div>
						</>
					)}

					{file && !transferId && (
						<>
							<div className='text-center space-y-3'>
								<h1 className='text-3xl font-bold'>File Selected</h1>
								<p className='text-muted-foreground mb-4'>
									Ready to generate a transfer link
								</p>
							</div>

							<FileCard file={file} className='mb-6' />

							<Button
								className='w-full py-6 rounded-xl hover-lift'
								onClick={generateReceiverLink}
								disabled={isGeneratingLink}
							>
								{isGeneratingLink ? (
									<>
										<Loader2Icon className='mr-2 h-5 w-5 animate-spin' />
										Generating Link...
									</>
								) : (
									<>
										<LinkIcon className='mr-2 h-5 w-5' />
										Generate Transfer Link
									</>
								)}
							</Button>
						</>
					)}

					{file && transferId && (
						<>
							<div className='text-center space-y-3'>
								<h1 className='text-3xl font-bold'>Ready to Transfer</h1>
								<p className='text-muted-foreground mb-4'>
									Share this link with the recipient
								</p>
							</div>

							<div className='flex flex-col items-center mb-6'>
								<WifiAnimation active={isConnected} />
							</div>

							<div className='flex w-full mb-6'>
								<div className='relative flex-1'>
									<div className='flex'>
										<Input
											value={`${window.location.origin}/receive?id=${transferId}`}
											readOnly
											className='pr-10 rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0'
										/>
										<Button
											variant='secondary'
											size='icon'
											className='rounded-l-none'
											onClick={copyLink}
										>
											{copied ? (
												<CheckIcon className='h-4 w-4 text-green-500' />
											) : (
												<CopyIcon className='h-4 w-4' />
											)}
										</Button>
									</div>
								</div>
							</div>

							<FileCard file={file} className='mb-6' />

							{isConnected ? (
								<div className='w-full space-y-4'>
									{transferProgress > 0 ? (
										<div className='space-y-3'>
											<div className='flex justify-between text-sm'>
												<span>Transferring...</span>
												<span>{transferProgress}%</span>
											</div>
											<div className='progress-bar'>
												<div
													className='progress-bar-fill'
													style={{ width: `${transferProgress}%` }}
												></div>
											</div>
										</div>
									) : (
										<Button
											className='w-full py-6 rounded-xl hover-lift'
											onClick={sendFile}
											disabled={fileSending}
										>
											{fileSending ? (
												<Loader2Icon className='mr-2 h-5 w-5 animate-spin' />
											) : (
												<SendIcon className='mr-2 h-5 w-5' />
											)}
											Send File
										</Button>
									)}
								</div>
							) : (
								<div className='flex items-center justify-center space-x-2 text-sm text-muted-foreground p-4 rounded-xl bg-secondary/50 glass'>
									<div className='dot-pulse'></div>
									<span className='ml-6'>
										Waiting for recipient to connect...
									</span>
								</div>
							)}
						</>
					)}
				</div>
			</main>
		</div>
	);
}
