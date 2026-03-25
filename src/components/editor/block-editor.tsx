"use client"

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useTransition,
} from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Undo2,
  Redo2,
  Copy,
  Monitor,
  Tablet,
  Smartphone,
  Search,
  Globe,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Settings,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { BlockToolbar } from "@/components/editor/block-toolbar"
import { BlockConfigPanel } from "@/components/editor/block-config-panel"
import { blockTypeLabels, getDefaultBlockData } from "@/lib/block-registry"
import {
  updatePageBlocksAction,
  publishPageAction,
  unpublishPageAction,
  updatePageMetaAction,
} from "@/app/actions/pages"

// ─── Types ───────────────────────────────────────────────────────────────────

type BlockData = Record<string, unknown> & { blockType: string }
type EditorBlock = BlockData & { _id: string; _hidden?: boolean }

type BlockEditorProps = {
  pageId: string
  pageTitle: string
  pageStatus: string
  initialBlocks: BlockData[]
  locale: string
  metaTitle?: string | null
  metaDescription?: string | null
  metaOgImage?: string | null
  metaKeywords?: string | null
}

type SaveStatus = "idle" | "saving" | "saved" | "error"
type Viewport = "desktop" | "tablet" | "mobile"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

function toEditorBlocks(blocks: BlockData[]): EditorBlock[] {
  return blocks.map((b) => ({ ...b, _id: generateId() }))
}

function toSaveBlocks(blocks: EditorBlock[]): Record<string, unknown>[] {
  return blocks.map(({ _id, _hidden, ...rest }) => rest)
}

// ─── useHistory hook ──────────────────────────────────────────────────────────

const MAX_HISTORY = 50

function useHistory(initial: EditorBlock[]) {
  const [past, setPast] = useState<EditorBlock[][]>([])
  const [present, setPresent] = useState<EditorBlock[]>(initial)
  const [future, setFuture] = useState<EditorBlock[][]>([])

  const set = useCallback(
    (next: EditorBlock[]) => {
      setPast((p) => [...p.slice(-(MAX_HISTORY - 1)), present])
      setPresent(next)
      setFuture([])
    },
    [present]
  )

  const undo = useCallback(() => {
    if (past.length === 0) return
    const prev = past[past.length - 1]
    setFuture((f) => [present, ...f])
    setPresent(prev)
    setPast((p) => p.slice(0, -1))
  }, [past, present])

  const redo = useCallback(() => {
    if (future.length === 0) return
    const next = future[0]
    setPast((p) => [...p, present])
    setPresent(next)
    setFuture((f) => f.slice(1))
  }, [future, present])

  return {
    blocks: present,
    setBlocks: set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  }
}

// ─── Block type colour map ────────────────────────────────────────────────────

const blockTypeColors: Record<string, string> = {
  hero: "bg-violet-500/10 text-violet-700 border-violet-200",
  features: "bg-blue-500/10 text-blue-700 border-blue-200",
  testimonials: "bg-amber-500/10 text-amber-700 border-amber-200",
  cta: "bg-green-500/10 text-green-700 border-green-200",
  "services-block": "bg-cyan-500/10 text-cyan-700 border-cyan-200",
  "portfolio-grid": "bg-pink-500/10 text-pink-700 border-pink-200",
  pricing: "bg-orange-500/10 text-orange-700 border-orange-200",
  "faq-block": "bg-teal-500/10 text-teal-700 border-teal-200",
  "rich-text": "bg-slate-500/10 text-slate-700 border-slate-200",
  "contact-form": "bg-rose-500/10 text-rose-700 border-rose-200",
}

// ─── SortableBlockItem ────────────────────────────────────────────────────────

type SortableBlockItemProps = {
  block: EditorBlock
  index: number
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onDuplicate: () => void
  onToggleHidden: () => void
}

function SortableBlockItem({
  block,
  index,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
  onToggleHidden,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block._id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.4 : 1,
  }

  const colorClass =
    blockTypeColors[block.blockType] ??
    "bg-gray-100 text-gray-700 border-gray-200"
  const label = blockTypeLabels[block.blockType] ?? block.blockType

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-center gap-2 rounded-lg border bg-background p-2 pr-1 text-sm transition-all",
        isSelected
          ? "border-primary/50 ring-1 ring-primary/20 shadow-sm"
          : "border-border/50 hover:border-border hover:shadow-sm",
        block._hidden && "opacity-50"
      )}
    >
      {/* Drag handle */}
      <button
        className="flex-none cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Verplaats block"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Block info */}
      <button
        className="flex flex-1 items-center gap-2 overflow-hidden text-left"
        onClick={onSelect}
      >
        <span className="min-w-0 flex-1 truncate font-medium leading-none">
          <span className="text-xs text-muted-foreground">{index + 1}. </span>
          {label}
        </span>
        <Badge
          variant="outline"
          className={cn("shrink-0 border text-[10px] px-1.5 py-0", colorClass)}
        >
          {block.blockType}
        </Badge>
      </button>

      {/* Actions */}
      <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation()
            onToggleHidden()
          }}
          title={block._hidden ? "Toon block" : "Verberg block"}
        >
          {block._hidden ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate()
          }}
          title="Dupliceer block"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          title="Verwijder block"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

// ─── BlockPreviewCard (center area) ──────────────────────────────────────────

function BlockPreviewCard({
  block,
  index,
  isSelected,
  onSelect,
}: {
  block: EditorBlock
  index: number
  isSelected: boolean
  onSelect: () => void
}) {
  const label = blockTypeLabels[block.blockType] ?? block.blockType
  const colorClass =
    blockTypeColors[block.blockType] ??
    "bg-gray-100 text-gray-700 border-gray-200"

  if (block._hidden) {
    return (
      <div
        className={cn(
          "rounded-lg border border-dashed border-border/40 bg-muted/30 p-4 text-center transition-all cursor-pointer",
          isSelected && "ring-1 ring-primary/20"
        )}
        onClick={onSelect}
      >
        <p className="text-xs text-muted-foreground/50">
          <EyeOff className="mr-1 inline-block h-3 w-3" />
          {label} (verborgen)
        </p>
      </div>
    )
  }

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative cursor-pointer rounded-xl border bg-background transition-all hover:shadow-md",
        isSelected
          ? "border-primary shadow-sm ring-2 ring-primary/20"
          : "border-border/60 hover:border-border"
      )}
    >
      {/* Top bar */}
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-2.5">
        <span className="text-xs text-muted-foreground/60">{index + 1}</span>
        <Badge
          variant="outline"
          className={cn(
            "border px-2 py-0 text-[10px] font-medium",
            colorClass
          )}
        >
          {label}
        </Badge>
        {isSelected && (
          <span className="ml-auto text-xs font-medium text-primary">
            Bewerken
            <ChevronRight className="ml-0.5 inline-block h-3 w-3" />
          </span>
        )}
      </div>

      {/* Block content preview */}
      <div className="p-4">
        <BlockPreviewContent block={block} />
      </div>
    </div>
  )
}

function BlockPreviewContent({ block }: { block: EditorBlock }) {
  const title = block.title as string | undefined
  const subtitle = block.subtitle as string | undefined
  const description = block.description as string | undefined

  switch (block.blockType) {
    case "hero":
      return (
        <div className="space-y-2 text-center py-4">
          <div className="mx-auto h-2 w-16 rounded bg-primary/20" />
          <p className="text-base font-semibold text-foreground/80">
            {title || "Hero titel"}
          </p>
          <p className="text-xs text-muted-foreground">
            {subtitle || "Ondertitel..."}
          </p>
          <div className="mx-auto mt-2 h-7 w-28 rounded-md bg-primary/20" />
        </div>
      )
    case "features": {
      const features = block.features as Array<{ title: string }> | undefined
      return (
        <div className="space-y-2">
          <p className="text-sm font-semibold">{title || "Features"}</p>
          <div className="grid grid-cols-3 gap-2">
            {(features ?? []).slice(0, 3).map((f, i) => (
              <div
                key={i}
                className="rounded-lg bg-muted/50 p-2 text-center text-xs text-muted-foreground"
              >
                {f.title}
              </div>
            ))}
          </div>
        </div>
      )
    }
    case "cta":
      return (
        <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3">
          <div>
            <p className="text-sm font-semibold">{title || "CTA titel"}</p>
            <p className="text-xs text-muted-foreground">
              {description || "Beschrijving"}
            </p>
          </div>
          <div className="h-7 w-24 shrink-0 rounded-md bg-primary/30" />
        </div>
      )
    case "rich-text": {
      const content = block.content as string | undefined
      const plain = content
        ? content.replace(/<[^>]*>/g, " ").trim().slice(0, 120)
        : "Tekst inhoud..."
      return (
        <p className="line-clamp-3 text-xs text-muted-foreground">{plain}</p>
      )
    }
    case "pricing": {
      const plans = block.plans as Array<{ name: string; price: string }> | undefined
      return (
        <div className="space-y-2">
          <p className="text-sm font-semibold">{title || "Prijzen"}</p>
          <div className="flex gap-2">
            {(plans ?? []).slice(0, 3).map((p, i) => (
              <div
                key={i}
                className="flex-1 rounded-lg border border-border/50 p-2 text-center"
              >
                <p className="text-xs font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
    case "testimonials": {
      const testimonials = block.testimonials as Array<{ author: string; quote: string }> | undefined
      return (
        <div className="space-y-2">
          <p className="text-sm font-semibold">{title || "Testimonials"}</p>
          {(testimonials ?? []).slice(0, 1).map((t, i) => (
            <div key={i} className="rounded-lg bg-muted/50 p-2">
              <p className="line-clamp-2 text-xs italic text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-1 text-xs font-medium">— {t.author}</p>
            </div>
          ))}
        </div>
      )
    }
    case "faq-block": {
      const items = block.items as Array<{ question: string }> | undefined
      return (
        <div className="space-y-1.5">
          <p className="text-sm font-semibold">{title || "FAQ"}</p>
          {(items ?? []).slice(0, 3).map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded border border-border/40 px-2 py-1.5"
            >
              <p className="text-xs">{item.question}</p>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </div>
          ))}
        </div>
      )
    }
    default:
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Settings className="h-4 w-4" />
          <p className="text-sm">
            {(blockTypeLabels[block.blockType] ?? block.blockType)} block
          </p>
        </div>
      )
  }
}

// ─── SaveStatusIndicator ──────────────────────────────────────────────────────

function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all",
        status === "saving" && "bg-muted text-muted-foreground",
        status === "saved" && "bg-green-500/10 text-green-700",
        status === "error" && "bg-destructive/10 text-destructive"
      )}
    >
      {status === "saving" && (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Opslaan…
        </>
      )}
      {status === "saved" && (
        <>
          <CheckCircle2 className="h-3 w-3" />
          Opgeslagen
        </>
      )}
      {status === "error" && (
        <>
          <AlertCircle className="h-3 w-3" />
          Fout bij opslaan
        </>
      )}
    </div>
  )
}

// ─── ViewportWrapper ──────────────────────────────────────────────────────────

const viewportWidths: Record<Viewport, string> = {
  desktop: "w-full",
  tablet: "max-w-[768px]",
  mobile: "max-w-[390px]",
}

// ─── Main BlockEditor component ───────────────────────────────────────────────

export function BlockEditor({
  pageId,
  pageTitle,
  pageStatus,
  initialBlocks,
  locale: _locale,  // reserved for future preview URL
  metaTitle,
  metaDescription,
  metaOgImage,
  metaKeywords,
}: BlockEditorProps) {
  const { blocks, setBlocks, undo, redo, canUndo, canRedo } = useHistory(
    toEditorBlocks(initialBlocks)
  )

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showBlockToolbar, setShowBlockToolbar] = useState(false)
  const [blockSearch, setBlockSearch] = useState("")
  const [viewport, setViewport] = useState<Viewport>("desktop")
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [status, setStatus] = useState(pageStatus)
  const [isPending, startTransition] = useTransition()

  // Auto-save debounce
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstMount = useRef(true)

  const selectedBlock = blocks.find((b) => b._id === selectedId) ?? null

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // ── Save function ────────────────────────────────────────────────────────

  const save = useCallback(
    async (blocksToSave: EditorBlock[]) => {
      setSaveStatus("saving")
      try {
        const result = await updatePageBlocksAction(
          pageId,
          toSaveBlocks(blocksToSave)
        )
        setSaveStatus(result.success ? "saved" : "error")
        if (result.success) {
          setTimeout(() => setSaveStatus("idle"), 2500)
        }
      } catch {
        setSaveStatus("error")
      }
    },
    [pageId]
  )

  // ── Auto-save on block changes ───────────────────────────────────────────

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      save(blocks)
    }, 3000)
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    }
  }, [blocks, save])

  // ── Keyboard shortcuts ───────────────────────────────────────────────────

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey

      if (ctrl && e.key === "s") {
        e.preventDefault()
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
        save(blocks)
        return
      }

      if (ctrl && e.shiftKey && e.key === "z") {
        e.preventDefault()
        redo()
        return
      }

      if (ctrl && e.key === "z") {
        e.preventDefault()
        undo()
        return
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [blocks, save, undo, redo])

  // ── Block operations ─────────────────────────────────────────────────────

  function addBlock(blockType: string) {
    const newBlock: EditorBlock = {
      blockType,
      ...getDefaultBlockData(blockType),
      _id: generateId(),
    }
    setBlocks([...blocks, newBlock])
    setSelectedId(newBlock._id)
    setShowBlockToolbar(false)
  }

  function removeBlock(id: string) {
    setBlocks(blocks.filter((b) => b._id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  function duplicateBlock(id: string) {
    const idx = blocks.findIndex((b) => b._id === id)
    if (idx === -1) return
    const source = blocks[idx]
    const duplicate: EditorBlock = { ...source, _id: generateId() }
    const next = [...blocks]
    next.splice(idx + 1, 0, duplicate)
    setBlocks(next)
    setSelectedId(duplicate._id)
  }

  function toggleHidden(id: string) {
    setBlocks(
      blocks.map((b) =>
        b._id === id ? { ...b, _hidden: !b._hidden } : b
      )
    )
  }

  function updateBlock(id: string, patch: Partial<BlockData>) {
    setBlocks(
      blocks.map((b) => (b._id === id ? { ...b, ...patch } : b))
    )
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = blocks.findIndex((b) => b._id === active.id)
    const newIndex = blocks.findIndex((b) => b._id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      setBlocks(arrayMove(blocks, oldIndex, newIndex))
    }
  }

  // ── Publish / Unpublish ──────────────────────────────────────────────────

  function handlePublish() {
    startTransition(async () => {
      const result = await publishPageAction(pageId)
      if (result.success) setStatus("published")
    })
  }

  function handleUnpublish() {
    startTransition(async () => {
      const result = await unpublishPageAction(pageId)
      if (result.success) setStatus("draft")
    })
  }

  // ── Left panel block list (filtered) ─────────────────────────────────────

  const filteredBlocks = blocks.filter((b) => {
    if (!blockSearch.trim()) return true
    const label = blockTypeLabels[b.blockType] ?? b.blockType
    return (
      label.toLowerCase().includes(blockSearch.toLowerCase()) ||
      b.blockType.toLowerCase().includes(blockSearch.toLowerCase())
    )
  })

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-muted/30">
      {/* ── Top toolbar ─────────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
        {/* Page title */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium">{pageTitle}</span>
          <Badge
            variant={status === "published" ? "default" : "secondary"}
            className="shrink-0 text-[10px]"
          >
            {status === "published" ? "Gepubliceerd" : "Concept"}
          </Badge>
        </div>

        {/* History */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={undo}
            disabled={!canUndo}
            title="Ongedaan maken (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={redo}
            disabled={!canRedo}
            title="Opnieuw (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Viewport toggles */}
        <div className="flex items-center rounded-md border border-border bg-muted/50 p-0.5">
          {(
            [
              { key: "desktop", Icon: Monitor, label: "Desktop" },
              { key: "tablet", Icon: Tablet, label: "Tablet" },
              { key: "mobile", Icon: Smartphone, label: "Mobiel" },
            ] as const
          ).map(({ key, Icon, label }) => (
            <button
              key={key}
              onClick={() => setViewport(key)}
              title={label}
              className={cn(
                "rounded p-1.5 transition-colors",
                viewport === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Save status + actions */}
        <SaveStatusIndicator status={saveStatus} />

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => {
            if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
            save(blocks)
          }}
          disabled={saveStatus === "saving"}
          title="Opslaan (Ctrl+S)"
        >
          <Save className="h-3.5 w-3.5" />
          Opslaan
        </Button>

        {status === "published" ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={handleUnpublish}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <EyeOff className="mr-1.5 h-3.5 w-3.5" />
            )}
            Depubliceer
          </Button>
        ) : (
          <Button
            size="sm"
            className="h-8"
            onClick={handlePublish}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Globe className="mr-1.5 h-3.5 w-3.5" />
            )}
            Publiceer
          </Button>
        )}
      </header>

      {/* ── Three-column body ────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT PANEL: Block list ─────────────────────────────────────── */}
        <aside className="flex w-64 shrink-0 flex-col border-r bg-background">
          <div className="flex items-center justify-between border-b px-3 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Blocks ({blocks.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setShowBlockToolbar((v) => !v)}
              title="Block toevoegen"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="border-b px-3 py-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                placeholder="Zoeken..."
                value={blockSearch}
                onChange={(e) => setBlockSearch(e.target.value)}
                className="h-7 pl-8 text-xs"
              />
            </div>
          </div>

          {/* Block list */}
          <div className="flex-1 space-y-1.5 overflow-y-auto p-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredBlocks.map((b) => b._id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredBlocks.map((block) => (
                  <SortableBlockItem
                    key={block._id}
                    block={block}
                    index={blocks.indexOf(block)}
                    isSelected={selectedId === block._id}
                    onSelect={() =>
                      setSelectedId(
                        selectedId === block._id ? null : block._id
                      )
                    }
                    onRemove={() => removeBlock(block._id)}
                    onDuplicate={() => duplicateBlock(block._id)}
                    onToggleHidden={() => toggleHidden(block._id)}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {blocks.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-xs text-muted-foreground">
                  Nog geen blocks.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 gap-1.5"
                  onClick={() => setShowBlockToolbar(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Voeg een block toe
                </Button>
              </div>
            )}

            {blocks.length > 0 && filteredBlocks.length === 0 && (
              <p className="py-6 text-center text-xs text-muted-foreground">
                Geen blocks gevonden.
              </p>
            )}
          </div>

          {/* Add block button (bottom) */}
          <div className="border-t p-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5 text-xs"
              onClick={() => setShowBlockToolbar((v) => !v)}
            >
              <Plus className="h-3.5 w-3.5" />
              Block toevoegen
            </Button>
          </div>
        </aside>

        {/* ── CENTER: Preview area ───────────────────────────────────────── */}
        <main className="relative flex flex-1 flex-col overflow-hidden">
          {/* Block toolbar overlay */}
          {showBlockToolbar && (
            <div className="absolute inset-x-0 top-0 z-20 overflow-y-auto bg-background/95 p-4 shadow-lg backdrop-blur-sm">
              <BlockToolbar
                onSelect={addBlock}
                onCancel={() => setShowBlockToolbar(false)}
              />
            </div>
          )}

          {/* Preview scroll area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div
              className={cn(
                "mx-auto transition-all duration-300",
                viewportWidths[viewport]
              )}
            >
              {blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 py-24 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Plus className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-base font-medium text-muted-foreground">
                    Nog geen blocks op deze pagina
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground/60">
                    Klik op &ldquo;Block toevoegen&rdquo; om te beginnen
                  </p>
                  <Button
                    className="mt-6 gap-2"
                    onClick={() => setShowBlockToolbar(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Block toevoegen
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {blocks.map((block, index) => (
                    <BlockPreviewCard
                      key={block._id}
                      block={block}
                      index={index}
                      isSelected={selectedId === block._id}
                      onSelect={() =>
                        setSelectedId(
                          selectedId === block._id ? null : block._id
                        )
                      }
                    />
                  ))}

                  {/* Add block at end */}
                  <button
                    onClick={() => setShowBlockToolbar(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/50 py-4 text-sm text-muted-foreground/60 transition-all hover:border-primary/30 hover:text-primary/70 hover:bg-primary/5"
                  >
                    <Plus className="h-4 w-4" />
                    Block toevoegen
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ── RIGHT PANEL: Config + SEO ──────────────────────────────────── */}
        <aside className="flex w-80 shrink-0 flex-col border-l bg-background">
          <Tabs defaultValue="content" className="flex flex-1 flex-col overflow-hidden">
            <TabsList className="w-full shrink-0 rounded-none border-b bg-transparent px-0 h-11">
              <TabsTrigger
                value="content"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs"
              >
                Inhoud
              </TabsTrigger>
              <TabsTrigger
                value="seo"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs"
              >
                SEO / Meta
              </TabsTrigger>
            </TabsList>

            {/* Content tab */}
            <TabsContent
              value="content"
            >
              {selectedBlock ? (
                <div className="space-y-4">
                  {/* Block header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">
                        {blockTypeLabels[selectedBlock.blockType] ??
                          selectedBlock.blockType}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Block bewerken
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => toggleHidden(selectedBlock._id)}
                        title={
                          selectedBlock._hidden ? "Toon block" : "Verberg block"
                        }
                      >
                        {selectedBlock._hidden ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => duplicateBlock(selectedBlock._id)}
                        title="Dupliceer block"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeBlock(selectedBlock._id)}
                        title="Verwijder block"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Config panel */}
                  <BlockConfigPanel
                    block={selectedBlock}
                    onChange={(patch) =>
                      updateBlock(selectedBlock._id, patch)
                    }
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-3 rounded-full bg-muted p-3">
                    <Settings className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Geen block geselecteerd
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    Klik op een block in de preview om het te bewerken
                  </p>
                </div>
              )}
            </TabsContent>

            {/* SEO tab */}
            <TabsContent
              value="seo"
            >
              <SeoPanel
                pageId={pageId}
                pageTitle={pageTitle}
                initialMetaTitle={metaTitle ?? ""}
                initialMetaDescription={metaDescription ?? ""}
                initialMetaOgImage={metaOgImage ?? ""}
                initialMetaKeywords={metaKeywords ?? ""}
              />
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  )
}

// ─── SeoPanel sub-component ───────────────────────────────────────────────────

type SeoPanelProps = {
  pageId: string
  pageTitle: string
  initialMetaTitle: string
  initialMetaDescription: string
  initialMetaOgImage: string
  initialMetaKeywords: string
}

function SeoPanel({
  pageId,
  pageTitle,
  initialMetaTitle,
  initialMetaDescription,
  initialMetaOgImage,
  initialMetaKeywords,
}: SeoPanelProps) {
  const [metaTitle, setMetaTitle] = useState(initialMetaTitle)
  const [metaDescription, setMetaDescription] = useState(initialMetaDescription)
  const [metaOgImage, setMetaOgImage] = useState(initialMetaOgImage)
  const [metaKeywords, setMetaKeywords] = useState(initialMetaKeywords)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const TITLE_MAX = 60
  const DESC_MAX = 160

  const titleLen = metaTitle.length
  const descLen = metaDescription.length

  const titleColor =
    titleLen === 0
      ? "text-muted-foreground"
      : titleLen <= TITLE_MAX
      ? "text-green-600"
      : "text-destructive"

  const descColor =
    descLen === 0
      ? "text-muted-foreground"
      : descLen <= DESC_MAX
      ? "text-green-600"
      : "text-destructive"

  async function saveMeta() {
    setSaveStatus("saving")
    try {
      const result = await updatePageMetaAction(pageId, {
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        metaOgImage: metaOgImage || undefined,
        metaKeywords: metaKeywords || undefined,
      })
      setSaveStatus(result.success ? "saved" : "error")
      if (result.success) {
        setTimeout(() => setSaveStatus("idle"), 2500)
      }
    } catch {
      setSaveStatus("error")
    }
  }

  function scheduleAutoSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(saveMeta, 3000)
  }

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  // Displayed title / description for SERP preview
  const serpTitle = metaTitle || pageTitle || "Paginatitel"
  const serpDesc =
    metaDescription ||
    "Voeg een metabeschrijving toe om hier een voorbeeld te zien."

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Google SERP preview */}
      <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Google zoekresultaat voorbeeld
        </p>
        <div className="space-y-1">
          {/* URL breadcrumb */}
          <p className="text-xs text-green-700">
            example.com &rsaquo;{" "}
            {pageTitle.toLowerCase().replace(/\s+/g, "-")}
          </p>
          {/* Title */}
          <p
            className={cn(
              "text-base font-medium leading-snug text-blue-700",
              serpTitle.length > TITLE_MAX && "text-blue-700/60"
            )}
          >
            {serpTitle.slice(0, TITLE_MAX + 5)}
            {serpTitle.length > TITLE_MAX + 5 && "…"}
          </p>
          {/* Description */}
          <p className="text-xs leading-relaxed text-muted-foreground">
            {serpDesc.slice(0, DESC_MAX + 10)}
            {serpDesc.length > DESC_MAX + 10 && "…"}
          </p>
        </div>
      </div>

      <Separator />

      {/* Meta title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium">Meta titel</label>
          <span className={cn("text-[10px] font-mono", titleColor)}>
            {titleLen}/{TITLE_MAX}
          </span>
        </div>
        <Input
          value={metaTitle}
          onChange={(e) => {
            setMetaTitle(e.target.value)
            scheduleAutoSave()
          }}
          placeholder={pageTitle || "Paginatitel voor zoekmachines"}
          className="text-sm"
        />
        {titleLen > TITLE_MAX && (
          <p className="text-[10px] text-destructive">
            Titel is te lang ({titleLen - TITLE_MAX} tekens over de limiet)
          </p>
        )}
      </div>

      {/* Meta description */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium">Meta beschrijving</label>
          <span className={cn("text-[10px] font-mono", descColor)}>
            {descLen}/{DESC_MAX}
          </span>
        </div>
        <Textarea
          value={metaDescription}
          onChange={(e) => {
            setMetaDescription(e.target.value)
            scheduleAutoSave()
          }}
          placeholder="Korte beschrijving voor zoekmachines (max 160 tekens)"
          rows={3}
          className="resize-none text-sm"
        />
        {descLen > DESC_MAX && (
          <p className="text-[10px] text-destructive">
            Beschrijving is te lang ({descLen - DESC_MAX} tekens over de
            limiet)
          </p>
        )}
      </div>

      {/* OG Image */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium">OG afbeelding (URL)</label>
        <Input
          value={metaOgImage}
          onChange={(e) => {
            setMetaOgImage(e.target.value)
            scheduleAutoSave()
          }}
          placeholder="https://..."
          type="url"
          className="text-sm"
        />
        <p className="text-[10px] text-muted-foreground">
          Aanbevolen formaat: 1200 × 630 px
        </p>
        {metaOgImage && (
          <div className="overflow-hidden rounded-lg border border-border/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={metaOgImage}
              alt="OG voorbeeld"
              className="h-28 w-full object-cover"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = "none"
              }}
            />
          </div>
        )}
      </div>

      {/* Keywords */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium">
          Keywords{" "}
          <span className="text-muted-foreground/60">(komma-gescheiden)</span>
        </label>
        <Textarea
          value={metaKeywords}
          onChange={(e) => {
            setMetaKeywords(e.target.value)
            scheduleAutoSave()
          }}
          placeholder="keyword1, keyword2, keyword3"
          rows={2}
          className="resize-none text-sm"
        />
      </div>

      <Separator />

      {/* Save button */}
      <div className="flex items-center justify-between">
        <SaveStatusIndicator status={saveStatus} />
        <Button
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => {
            if (saveTimer.current) clearTimeout(saveTimer.current)
            saveMeta()
          }}
          disabled={saveStatus === "saving"}
        >
          {saveStatus === "saving" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          SEO opslaan
        </Button>
      </div>
    </div>
  )
}
