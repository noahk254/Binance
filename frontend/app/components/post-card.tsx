import type { ReactNode } from "react";
import { Avatar } from "./avatar";

export function PostCard({ author, time, verified, children, media, counts = "◯ 0   ↻ 0   ♡ 0   ↗" }: { author: string; time: string; verified?: boolean; children: ReactNode; media?: ReactNode; counts?: string }) {
  return <article className="border-b border-line py-5"><div className="flex items-center gap-3"><Avatar label={author} size={38}/><span className="min-w-0 flex-1"><b className="block truncate text-sm text-text">{author} {verified ? <i className="not-italic text-yellow">✓</i> : null}</b><small className="text-muted">{time}</small></span><span className="text-muted">•••</span></div><div className="mt-3">{children}</div>{media ? <div className="mt-3 overflow-hidden rounded-xl">{media}</div> : null}<p className="mt-3 whitespace-pre text-sm text-muted">{counts}</p></article>;
}
