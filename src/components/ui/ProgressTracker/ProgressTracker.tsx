import { forwardRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import {
  CaretDown,
  CaretUp,
  DownloadSimple,
  Eye,
  File as FileIcon,
  Info,
  ChatText,
} from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";
import {
  ROLE_BADGE_TOKENS,
  STAGE_TOKENS,
  STATUS_TOKENS,
  type ActivityRoleTone,
  type ActivityStatusTone,
  type ProgressTrackerStageStatus,
} from "./tokens";

/* ===========================================================================
 * ProgressTracker — the IFMIS workflow tracker (Figma node 17337:4349).
 *
 * Three coordinated regions:
 *   1. Stage bar     — connected status pills (Creator → Verifier → Approver)
 *                      sitting on a coloured connector rail.
 *   2. Stage Timeline — the left rail: a dotted vertical list of every actor
 *                      with their status badge + timestamp.
 *   3. Activity Log   — the right panel: a Remarks / Comments / Files tab
 *                      switcher over a stack of activity entries. Remarks are
 *                      tinted status cards, Comments are aligned bubbles, and
 *                      Files are compact rows.
 *
 * Driven entirely by props; works controlled (`activeTab` + `onTabChange`) or
 * uncontrolled (`defaultTab`).
 * ========================================================================= */

export type { ProgressTrackerStageStatus } from "./tokens";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ProgressTrackerStage {
  /** Stable id (React key). */
  id: string;
  /** Visible label, e.g. `"Creator"`. */
  label: ReactNode;
  /** Workflow state — drives colour + glyph. */
  status: ProgressTrackerStageStatus;
  /** Override the default glyph (CheckCircle for done, Clock otherwise). */
  icon?: ReactNode;
  /**
   * Show the expand caret. Defaults to `true` for `done`/`active` stages and
   * `false` for `pending`.
   */
  showCaret?: boolean;
  /** Caret points up when expanded. Defaults to `true` for the `active` stage. */
  expanded?: boolean;
  /** Fires when the stage pill is clicked. */
  onClick?: () => void;
}

export interface ProgressTrackerTimelineItem {
  id: string;
  /** Person's name (primary line). */
  name: ReactNode;
  /** Role / sub-line, e.g. `"Creator"`. */
  role?: ReactNode;
  /** Timestamp line, e.g. `"28 May 2026, 11:00 AM"`. */
  timestamp?: ReactNode;
  /** Rail dot status. */
  status: ProgressTrackerStageStatus;
  /** Right-aligned status badge — omit to hide. */
  badge?: { label: ReactNode; tone: ActivityStatusTone };
}

export type ProgressTrackerTabId = "remarks" | "comments" | "files";

export interface ProgressTrackerTab {
  id: ProgressTrackerTabId;
  label: ReactNode;
  count?: number;
}

export interface ActivityFile {
  id?: string;
  /** File name shown in the chip. */
  name: string;
  /** Preview (eye) handler. */
  onPreview?: () => void;
  /** Download handler. */
  onDownload?: () => void;
}

export type ActivityEntryTone = ActivityRoleTone;

export interface ActivityEntry {
  id: string;
  /** Author. */
  user: { name: ReactNode; avatarSrc?: string; initials?: string };
  /** Role label shown next to the name / as a badge. */
  role: ReactNode;
  /** Role tone — colours the comments/files role badge. */
  roleTone?: ActivityEntryTone;
  /**
   * Status action badge shown in a **remarks** card header (Submitted /
   * Return / …). Also tints the card surface. Omit for a plain card.
   */
  status?: { label: ReactNode; tone: ActivityStatusTone };
  /** Body copy. */
  body?: ReactNode;
  /** Attached files. */
  files?: ActivityFile[];
  /**
   * Render `files` as a single collapsed "Multiple Files Attached" chip with
   * an expand caret (the Files-tab affordance). Defaults to `true` when more
   * than one file is attached.
   */
  collapseFiles?: boolean;
  /** Timestamp, bottom-aligned. */
  timestamp?: ReactNode;
  /** Chat alignment for the **comments** tab. Defaults to `"left"`. */
  align?: "left" | "right";
}

export interface ProgressTrackerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The top connected stage pills. */
  stages: ProgressTrackerStage[];
  /** Left rail title. Defaults to `"Stage Timeline"`. */
  timelineTitle?: ReactNode;
  /** Left rail items. */
  timeline: ProgressTrackerTimelineItem[];
  /** Activity-log title. Defaults to `"Activity Log"`. */
  activityTitle?: ReactNode;
  /** Tab definitions (with counts). */
  tabs: ProgressTrackerTab[];
  /** Controlled active tab. Pair with `onTabChange`. */
  activeTab?: ProgressTrackerTabId;
  /** Uncontrolled initial tab. Defaults to the first tab. */
  defaultTab?: ProgressTrackerTabId;
  /** Fires when the active tab changes. */
  onTabChange?: (tab: ProgressTrackerTabId) => void;
  /**
   * Activity entries, keyed by tab. The active tab's entries render in that
   * tab's layout (cards / bubbles / rows).
   */
  entries: Partial<Record<ProgressTrackerTabId, ActivityEntry[]>>;
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                     */
/* -------------------------------------------------------------------------- */

function initialsOf(name: ReactNode): string {
  if (typeof name !== "string") return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  return (parts[0]![0]! + (parts.length > 1 ? parts[parts.length - 1]![0]! : ""))
    .toUpperCase();
}

function Avatar({
  src,
  name,
  initials,
  className,
}: {
  src?: string;
  name: ReactNode;
  initials?: string;
  className?: string;
}) {
  const label = initials ?? initialsOf(name);
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full",
        "border border-white bg-neutral-200 text-body-xs font-semibold text-heading shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      {src ? (
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        label
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* PDF badge + file chips                                                     */
/* -------------------------------------------------------------------------- */

function PdfBadge({ stacked = false }: { stacked?: boolean }) {
  return (
    <span className="relative inline-flex shrink-0" aria-hidden="true">
      {stacked && (
        <>
          <span className="absolute left-1 top-0 grid size-7 -rotate-6 place-items-center rounded-md bg-red-300" />
          <span className="absolute left-0.5 top-0 grid size-7 -rotate-3 place-items-center rounded-md bg-red-400" />
        </>
      )}
      <span className="relative grid size-7 place-items-center rounded-md bg-red-500 text-[7px] font-bold leading-none text-white">
        PDF
      </span>
    </span>
  );
}

function FileChip({ file }: { file: ActivityFile }) {
  return (
    <div className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-grey-200 bg-surface-card px-2 py-1.5">
      <PdfBadge />
      <span className="min-w-0 flex-1 truncate text-body-xs font-medium text-body-primary">
        {file.name}
      </span>
      <span className="flex shrink-0 items-center gap-2 text-body-secondary">
        <button
          type="button"
          onClick={file.onPreview}
          aria-label={`Preview ${file.name}`}
          className="transition-colors hover:text-body-primary focus-visible:outline-none focus-visible:text-body-primary"
        >
          <Eye weight="regular" className="size-5" />
        </button>
        <button
          type="button"
          onClick={file.onDownload}
          aria-label={`Download ${file.name}`}
          className="transition-colors hover:text-body-primary focus-visible:outline-none focus-visible:text-body-primary"
        >
          <DownloadSimple weight="regular" className="size-5" />
        </button>
      </span>
    </div>
  );
}

function MultipleFilesChip({ files }: { files: ActivityFile[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "inline-flex w-fit items-center gap-2 rounded-lg border border-grey-200 bg-surface-card py-1.5 pl-2 pr-1.5",
          "text-body-xs font-medium text-body-primary transition-colors hover:bg-neutral-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        )}
      >
        <PdfBadge stacked />
        <span className="pl-2">Multiple Files Attached</span>
        <CaretDown
          weight="bold"
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <FileChip key={f.id ?? i} file={f} />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Badges                                                                     */
/* -------------------------------------------------------------------------- */

function RoleBadge({ label, tone }: { label: ReactNode; tone: ActivityRoleTone }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-body-xs font-semibold leading-none",
        ROLE_BADGE_TOKENS[tone],
      )}
    >
      {label}
    </span>
  );
}

function StatusBadge({
  label,
  tone,
  variant,
}: {
  label: ReactNode;
  tone: ActivityStatusTone;
  variant: "solid" | "outline";
}) {
  const t = STATUS_TOKENS[tone];
  const Glyph = t.glyph;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-body-xs font-semibold leading-none",
        variant === "solid" ? t.solid : cn("border", t.outline),
      )}
    >
      <Glyph weight="bold" className="size-4 shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Stage bar                                                                  */
/* -------------------------------------------------------------------------- */

/** A single connector segment between (or around) stage pills. */
function Connector({ from, to }: { from?: string; to?: string }) {
  const left = from ?? to!;
  const right = to ?? from!;
  return (
    <span
      aria-hidden="true"
      className="h-2.5 min-w-3 flex-1 rounded-full"
      style={{ background: `linear-gradient(90deg, ${left} 0%, ${right} 100%)` }}
    />
  );
}

function StagePill({ stage }: { stage: ProgressTrackerStage }) {
  const t = STAGE_TOKENS[stage.status];
  const Glyph = t.glyph;
  const showCaret = stage.showCaret ?? stage.status !== "pending";
  const expanded = stage.expanded ?? stage.status === "active";

  return (
    <button
      type="button"
      onClick={stage.onClick}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-2 rounded-full pl-1 pr-3 shadow-sm transition-[filter]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        stage.onClick && "hover:brightness-[1.02]",
        t.pill,
      )}
    >
      <span
        className={cn(
          "grid size-7 shrink-0 place-items-center rounded-full",
          t.pillIconChip,
          t.pillIconColor,
        )}
      >
        {stage.icon ?? <Glyph weight="fill" className="size-5" aria-hidden="true" />}
      </span>
      <span className={cn("text-h5 leading-none", t.pillText)}>{stage.label}</span>
      {showCaret &&
        (expanded ? (
          <CaretUp weight="bold" className={cn("size-4 shrink-0", t.pillText)} aria-hidden="true" />
        ) : (
          <CaretDown weight="bold" className={cn("size-4 shrink-0", t.pillText)} aria-hidden="true" />
        ))}
    </button>
  );
}

function StageBar({ stages }: { stages: ProgressTrackerStage[] }) {
  return (
    <div className="flex w-full items-center gap-1.5">
      {stages.map((stage, i) => {
        const color = STAGE_TOKENS[stage.status].connector;
        const prevColor = i > 0 ? STAGE_TOKENS[stages[i - 1]!.status].connector : color;
        return (
          <div key={stage.id} className="flex flex-1 items-center gap-1.5">
            <Connector from={i === 0 ? color : prevColor} to={color} />
            <StagePill stage={stage} />
            {i === stages.length - 1 && <Connector from={color} to={color} />}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stage Timeline (left rail)                                                 */
/* -------------------------------------------------------------------------- */

function TimelineRow({
  item,
  isLast,
}: {
  item: ProgressTrackerTimelineItem;
  isLast: boolean;
}) {
  const t = STAGE_TOKENS[item.status];
  const Glyph = t.glyph;
  return (
    <div className="grid grid-cols-[20px_1fr] gap-x-3">
      {/* Rail: dot + connector */}
      <div className="flex flex-col items-center">
        <span className={cn("grid size-5 shrink-0 place-items-center rounded-full", t.dot, t.dotIcon)}>
          <Glyph weight="fill" className="size-3.5" aria-hidden="true" />
        </span>
        {!isLast && <span aria-hidden="true" className="-mb-1 mt-1 w-0.5 flex-1 rounded-full bg-grey-200" />}
      </div>

      {/* Content */}
      <div className={cn("flex flex-col gap-1", !isLast && "pb-5")}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-h5 leading-tight text-body-primary">{item.name}</p>
          {item.badge && (
            <StatusBadge label={item.badge.label} tone={item.badge.tone} variant="solid" />
          )}
        </div>
        {item.role != null && (
          <p className="text-body-xs leading-none text-body-secondary">{item.role}</p>
        )}
        {item.timestamp != null && (
          <p className="text-body-xs leading-none text-body-secondary">{item.timestamp}</p>
        )}
      </div>
    </div>
  );
}

function StageTimeline({
  title,
  items,
}: {
  title: ReactNode;
  items: ProgressTrackerTimelineItem[];
}) {
  return (
    <div className="flex w-full flex-col gap-4 lg:w-[380px] lg:shrink-0">
      <h3 className="text-h4 text-heading">{title}</h3>
      <div className="flex flex-col">
        {items.map((item, i) => (
          <TimelineRow key={item.id} item={item} isLast={i === items.length - 1} />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Activity Log (right panel)                                                 */
/* -------------------------------------------------------------------------- */

const TAB_ICON: Record<ProgressTrackerTabId, typeof Info> = {
  remarks: Info,
  comments: ChatText,
  files: FileIcon,
};

function TabSwitcher({
  tabs,
  active,
  onChange,
}: {
  tabs: ProgressTrackerTab[];
  active: ProgressTrackerTabId;
  onChange: (id: ProgressTrackerTabId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Activity log"
      className="inline-flex items-center gap-1 rounded-full border border-surface-border-grey/30 bg-surface-grey-bg p-1"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        const Glyph = TAB_ICON[tab.id];
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-2 text-h6 leading-none transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isActive
                ? "bg-purple-600 text-white"
                : "text-body-secondary hover:bg-neutral-100",
            )}
          >
            <Glyph weight={isActive ? "fill" : "regular"} className="size-5 shrink-0" aria-hidden="true" />
            <span>{tab.label}</span>
            {tab.count != null && (
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full text-[12px] font-semibold leading-none",
                  isActive ? "bg-white text-purple-700" : "bg-grey-200 text-body-secondary",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Header row shared by remarks cards and comment bubbles. */
function EntryHeader({
  entry,
  badge,
  showRoleInName = false,
}: {
  entry: ActivityEntry;
  badge: ReactNode;
  /** Append " (Role)" after the name — the Remarks-card treatment. */
  showRoleInName?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex min-w-0 items-center gap-2">
        <Avatar src={entry.user.avatarSrc} name={entry.user.name} initials={entry.user.initials} />
        <span className="truncate text-h5 leading-tight text-body-primary">
          {entry.user.name}
          {showRoleInName && entry.role != null && (
            <span className="text-body-primary"> ({entry.role})</span>
          )}
        </span>
      </span>
      {badge}
    </div>
  );
}

function EntryBody({ entry }: { entry: ActivityEntry }) {
  const collapse = entry.collapseFiles ?? (entry.files?.length ?? 0) > 1;
  return (
    <>
      {entry.body != null && (
        <p className="text-body-xs leading-[21px] text-body-secondary">{entry.body}</p>
      )}
      {entry.files && entry.files.length > 0 && (
        <div className="flex flex-col gap-2">
          {collapse ? (
            <MultipleFilesChip files={entry.files} />
          ) : (
            entry.files.map((f, i) => <FileChip key={f.id ?? i} file={f} />)
          )}
        </div>
      )}
    </>
  );
}

/** Remarks card — tinted by status, full width. */
function RemarksCard({ entry }: { entry: ActivityEntry }) {
  const tint = entry.status ? STATUS_TOKENS[entry.status.tone].card : "border-grey-200 bg-surface-card";
  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border p-3", tint)}>
      <EntryHeader
        entry={entry}
        showRoleInName
        badge={
          entry.status && (
            <StatusBadge label={entry.status.label} tone={entry.status.tone} variant="outline" />
          )
        }
      />
      {(entry.body != null || (entry.files && entry.files.length > 0) || entry.timestamp != null) && (
        <div className="flex flex-col gap-3">
          <EntryBody entry={entry} />
          {entry.timestamp != null && (
            <p className="self-end text-body-xs leading-none text-body-secondary">{entry.timestamp}</p>
          )}
        </div>
      )}
    </div>
  );
}

/** Comment bubble — neutral card, aligned left/right. */
function CommentBubble({ entry }: { entry: ActivityEntry }) {
  const align = entry.align ?? "left";
  return (
    <div
      className={cn(
        "flex w-full max-w-[640px] flex-col gap-3 rounded-xl border border-grey-200 bg-neutral-50 p-3",
        align === "right" && "ml-auto",
      )}
    >
      <EntryHeader
        entry={entry}
        badge={<RoleBadge label={entry.role} tone={entry.roleTone ?? "neutral"} />}
      />
      <EntryBody entry={entry} />
      {entry.timestamp != null && (
        <p className="self-end text-body-xs leading-none text-body-secondary">{entry.timestamp}</p>
      )}
    </div>
  );
}

/** File row — compact, header + (file chip · timestamp). */
function FileRow({ entry }: { entry: ActivityEntry }) {
  const collapse = entry.collapseFiles ?? (entry.files?.length ?? 0) > 1;
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-grey-200 bg-neutral-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2">
          <Avatar src={entry.user.avatarSrc} name={entry.user.name} initials={entry.user.initials} />
          <span className="truncate text-h5 leading-tight text-body-primary">{entry.user.name}</span>
        </span>
        <RoleBadge label={entry.role} tone={entry.roleTone ?? "neutral"} />
      </div>
      {entry.files && entry.files.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          {collapse ? (
            <MultipleFilesChip files={entry.files} />
          ) : (
            entry.files.map((f, i) => <FileChip key={f.id ?? i} file={f} />)
          )}
          {entry.timestamp != null && (
            <p className="shrink-0 text-body-xs leading-none text-body-secondary">{entry.timestamp}</p>
          )}
        </div>
      )}
    </div>
  );
}

function ActivityLog({
  title,
  tabs,
  active,
  onChange,
  entries,
}: {
  title: ReactNode;
  tabs: ProgressTrackerTab[];
  active: ProgressTrackerTabId;
  onChange: (id: ProgressTrackerTabId) => void;
  entries: ActivityEntry[];
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-h3 text-heading">{title}</h3>
        <TabSwitcher tabs={tabs} active={active} onChange={onChange} />
      </div>

      <div role="tabpanel" className="flex flex-col gap-3">
        {entries.map((entry) =>
          active === "remarks" ? (
            <RemarksCard key={entry.id} entry={entry} />
          ) : active === "comments" ? (
            <CommentBubble key={entry.id} entry={entry} />
          ) : (
            <FileRow key={entry.id} entry={entry} />
          ),
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ProgressTracker (root)                                                     */
/* -------------------------------------------------------------------------- */

/**
 * `ProgressTracker` — connected stage bar + stage timeline + tabbed activity
 * log. See the file header for the anatomy.
 *
 * @example
 * ```jsx
 * <ProgressTracker
 *   stages={[
 *     { id: "c", label: "Creator", status: "done" },
 *     { id: "v", label: "Verifier", status: "active" },
 *     { id: "a", label: "Approver", status: "pending" },
 *   ]}
 *   timeline={[
 *     { id: "c", name: "Mukesh Kumar", role: "Creator", timestamp: "28 May 2026, 11:00 AM",
 *       status: "done", badge: { label: "Submitted", tone: "submitted" } },
 *     { id: "v", name: "Rahul Kumar", role: "Verifier", timestamp: "28 May 2026, 11:00 AM",
 *       status: "active", badge: { label: "Pending", tone: "pending" } },
 *     { id: "a", name: "Animesh Sadh", role: "Approver", status: "pending" },
 *   ]}
 *   tabs={[
 *     { id: "remarks", label: "Remarks", count: 5 },
 *     { id: "comments", label: "Comments", count: 3 },
 *     { id: "files", label: "Files", count: 2 },
 *   ]}
 *   entries={{ remarks: [...], comments: [...], files: [...] }}
 * />
 * ```
 */
export const ProgressTracker = forwardRef<HTMLDivElement, ProgressTrackerProps>(
  (
    {
      stages,
      timelineTitle = "Stage Timeline",
      timeline,
      activityTitle = "Activity Log",
      tabs,
      activeTab,
      defaultTab,
      onTabChange,
      entries,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = activeTab !== undefined;
    const [internalTab, setInternalTab] = useState<ProgressTrackerTabId>(
      defaultTab ?? tabs[0]?.id ?? "remarks",
    );
    const current = isControlled ? activeTab : internalTab;

    const setTab = (id: ProgressTrackerTabId) => {
      if (!isControlled) setInternalTab(id);
      onTabChange?.(id);
    };

    const activeEntries = entries[current] ?? [];

    return (
      <div ref={ref} className={cn("flex w-full flex-col gap-4", className)} {...props}>
        <StageBar stages={stages} />

        <div className="flex flex-col gap-6 rounded-3xl bg-neutral-50 p-5 lg:flex-row lg:gap-8">
          <StageTimeline title={timelineTitle} items={timeline} />
          <ActivityLog
            title={activityTitle}
            tabs={tabs}
            active={current}
            onChange={setTab}
            entries={activeEntries}
          />
        </div>
      </div>
    );
  },
);

ProgressTracker.displayName = "ProgressTracker";
