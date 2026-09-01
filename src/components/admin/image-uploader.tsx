"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageUploader({
  folder,
  value,
  onChange,
  multiple = true,
}: {
  folder: string;
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFiles(files: FileList | File[]) {
    setError(null);
    setUploading(true);
    try {
      const list = multiple ? Array.from(files) : [Array.from(files)[0]].filter(Boolean);
      const uploaded: string[] = [];
      for (const file of list) {
        const form = new FormData();
        form.append("file", file);
        form.append("folder", folder);
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setError(data.message ?? "Upload failed.");
          continue;
        }
        uploaded.push(data.url);
      }
      onChange(multiple ? [...value, ...uploaded] : uploaded.slice(0, 1));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleThumbDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleThumbDrop(index: number) {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === index) return;
    const next = [...value];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    onChange(next);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors",
          dragOver ? "border-accent bg-accent/5" : "border-[#333333] hover:border-accent/50"
        )}
      >
        {uploading ? (
          <Loader2 size={22} className="animate-spin text-accent" />
        ) : (
          <Upload size={22} className="text-white/40" />
        )}
        <p className="text-sm text-white/60">
          Drag & drop {multiple ? "images" : "an image"} here, or click to browse
        </p>
        <p className="text-xs text-white/30">PNG, JPEG, or WebP — up to 10MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {value.map((src, i) => (
            <div
              key={src + i}
              draggable={multiple}
              onDragStart={() => handleThumbDragStart(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleThumbDrop(i)}
              className="group relative aspect-square overflow-hidden rounded-lg border border-[#222222] bg-[#1a1a1a]"
            >
              <Image src={src} alt={`Image ${i + 1}`} fill sizes="120px" className="object-cover" />
              {multiple && (
                <span className="absolute left-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
                  <GripVertical size={14} />
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove image"
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
