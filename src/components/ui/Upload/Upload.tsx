import { forwardRef, useId, useState } from "react";
import {
  ArrowCounterClockwise,
  CaretDown,
  Eye,
  FilePdf,
  Plus,
  Spinner,
  Trash,
  UploadSimple,
  User,
  Warning,
} from "@phosphor-icons/react";
import { cn } from "../../../lib/cn";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A single file shown in the `uploaded` state.
 *
 * @property id    Stable key, passed back to `onPreviewFile`/`onDeleteFile`.
 * @property name  Display name shown in the chip and list rows.
 * @property icon  Optional per-file icon (e.g. an image thumbnail or a
 *                 different file-type glyph). Falls back to the component's
 *                 `fileIcon` when omitted.
 */
export interface UploadFile {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

/**
 * The five visual states from the Figma "Upload Button" component:
 *   - `default`   — the call-to-action button + format hint.
 *   - `uploading` — blue progress button + Cancel.
 *   - `error`     — red error button + Retry.
 *   - `uploaded`  — file chip with a caret. Collapsed shows "Add More
 *                   Files"; expanded shows the dropdown list of files, each
 *                   with preview (eye) and delete (trash) actions.
 */
export type UploadState = "default" | "uploading" | "error" | "uploaded";

export interface UploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onError"> {
  /** Which visual state to render. */
  state?: UploadState;

  /* --- Content (all dynamic) ------------------------------------------- */
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /**
   * Icon shown before the label. Defaults to a user glyph; pass `null` to
   * hide it, or any node (e.g. `<Paperclip />`) to override.
   */
  labelIcon?: React.ReactNode | null;
  /** Helper text shown under/beside the button. */
  hint?: React.ReactNode;

  /** Label for the default call-to-action button. */
  uploadLabel?: React.ReactNode;
  /** Icon for the default call-to-action button. */
  uploadIcon?: React.ReactNode;

  /** Renders the uploading label from the current `progress`. */
  uploadingLabel?: (progress: number) => React.ReactNode;
  /** Icon shown (spinning) while uploading. */
  uploadingIcon?: React.ReactNode;
  /** Upload progress 0–100, fed to `uploadingLabel`. */
  progress?: number;

  /** Label for the error button. */
  errorLabel?: React.ReactNode;
  /** Icon for the error button. */
  errorIcon?: React.ReactNode;

  /** Label for the Cancel pill (uploading state). */
  cancelLabel?: React.ReactNode;
  /** Label for the Retry pill (error state). */
  retryLabel?: React.ReactNode;
  /** Icon for the Retry pill. */
  retryIcon?: React.ReactNode;

  /** Label for the "Add More Files" button (collapsed uploaded state). */
  addMoreLabel?: React.ReactNode;
  /** Icon for the "Add More Files" button. */
  addMoreIcon?: React.ReactNode;

  /** Default icon for each file (overridden by `UploadFile.icon`). */
  fileIcon?: React.ReactNode;
  /** Icon for a file's preview (eye) action. */
  previewIcon?: React.ReactNode;
  /** Icon for a file's delete (trash) action. */
  deleteIcon?: React.ReactNode;
  /** Icon for the chip's expand/collapse caret. */
  expandIcon?: React.ReactNode;

  /* --- Data ------------------------------------------------------------ */
  /** Files to list in the `uploaded` state. The first drives the chip. */
  files?: UploadFile[];
  /**
   * Whether the file dropdown is expanded. Omit to let the component manage
   * it internally (toggled by the chip caret).
   */
  expanded?: boolean;
  /** Initial expanded value when uncontrolled. Default `false`. */
  defaultExpanded?: boolean;

  /* --- Callbacks ------------------------------------------------------- */
  /** Fired when the primary Upload button is clicked. */
  onUpload?: () => void;
  /** Fired by the Cancel button while uploading. */
  onCancel?: () => void;
  /** Fired by the Retry button in the error state. */
  onRetry?: () => void;
  /** Fired by the "Add More Files" button. */
  onAddMore?: () => void;
  /** Fired when the chip caret toggles the dropdown. */
  onToggleExpand?: (expanded: boolean) => void;
  /** Fired by a file's preview (eye) action. */
  onPreviewFile?: (file: UploadFile) => void;
  /** Fired by a file's delete (trash) action. */
  onDeleteFile?: (file: UploadFile) => void;
}

/* -------------------------------------------------------------------------- */
/* Icon slot — normalises any passed icon node to a fixed pixel size          */
/* -------------------------------------------------------------------------- */

/**
 * Wraps an arbitrary icon node and forces its `<svg>` to a consistent size,
 * so consumers can pass any icon (Phosphor, lucide, custom SVG) without
 * worrying about dimensions. `sizeClass` is a Tailwind `[&>svg]:size-*`.
 */
function IconSlot({
  children,
  sizeClass,
  className,
}: {
  children: React.ReactNode;
  sizeClass: string;
  className?: string;
}) {
  if (children == null) return null;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        sizeClass,
        className,
      )}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared building blocks                                                     */
/* -------------------------------------------------------------------------- */

/** Full-width 44px action button used by default/uploading/error states. */
function PrimaryActionButton({
  color,
  icon,
  label,
  spinning = false,
  onClick,
  ariaLabel,
}: {
  color: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  spinning?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "flex h-11 w-full items-center justify-center gap-1.5 rounded-2xl px-3",
        "text-base font-semibold text-white",
        "transition-[filter] hover:brightness-110 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
        color,
      )}
    >
      <IconSlot sizeClass="[&>svg]:size-6" className={cn(spinning && "animate-spin")}>
        {icon}
      </IconSlot>
      <span className="whitespace-nowrap leading-none">{label}</span>
    </button>
  );
}

/** Compact 32px / 116px secondary button (Cancel / Retry). */
function PillButton({
  label,
  icon,
  tone,
  onClick,
}: {
  label: React.ReactNode;
  icon?: React.ReactNode;
  tone: "grey" | "purple";
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 w-[116px] shrink-0 items-center justify-center gap-1.5 rounded-2xl border px-2",
        "bg-white text-sm font-semibold transition-colors focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
        tone === "purple"
          ? "border-purple-600 text-purple-600 hover:bg-purple-50"
          : "border-surface-border-grey text-body-secondary hover:bg-grey-50",
      )}
    >
      <IconSlot sizeClass="[&>svg]:size-5">{icon}</IconSlot>
      <span className="whitespace-nowrap leading-none">{label}</span>
    </button>
  );
}

/** White, bordered chip showing the active file name + a caret toggle. */
function FileChip({
  icon,
  name,
  expanded,
  expandIcon,
  onToggle,
}: {
  icon: React.ReactNode;
  name: React.ReactNode;
  expanded: boolean;
  expandIcon: React.ReactNode;
  onToggle?: () => void;
}) {
  return (
    <div className="flex h-11 w-full items-center justify-between rounded-2xl border border-surface-border-grey bg-white px-3">
      <span className="flex items-center gap-1.5 text-body-secondary">
        <IconSlot sizeClass="[&>svg]:size-6">{icon}</IconSlot>
        <span className="whitespace-nowrap text-base font-semibold leading-none">
          {name}
        </span>
      </span>
      <button
        type="button"
        onClick={onToggle}
        aria-label={expanded ? "Collapse files" : "Expand files"}
        aria-expanded={expanded}
        className={cn(
          "flex items-center rounded-lg border border-grey-200 bg-surface-grey-bg px-1.5 py-1",
          "transition-colors hover:bg-grey-100 focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-blue-400",
        )}
      >
        <IconSlot
          sizeClass="[&>svg]:size-4"
          className={cn(
            "text-body-secondary transition-transform",
            expanded && "rotate-180",
          )}
        >
          {expandIcon}
        </IconSlot>
      </button>
    </div>
  );
}

/** A single row inside the expanded file dropdown. */
function FileRow({
  file,
  fileIcon,
  previewIcon,
  deleteIcon,
  onPreview,
  onDelete,
}: {
  file: UploadFile;
  fileIcon: React.ReactNode;
  previewIcon: React.ReactNode;
  deleteIcon: React.ReactNode;
  onPreview?: (file: UploadFile) => void;
  onDelete?: (file: UploadFile) => void;
}) {
  return (
    <div className="flex h-11 w-full items-center rounded-xl px-3 transition-colors hover:bg-purple-25">
      <div className="flex w-full items-center justify-between">
        <span className="flex items-center gap-1.5 text-heading">
          <IconSlot sizeClass="[&>svg]:size-6">{file.icon ?? fileIcon}</IconSlot>
          <span className="whitespace-nowrap text-base font-medium leading-6">
            {file.name}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPreview?.(file)}
            aria-label={`Preview ${file.name}`}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg border border-grey-200 bg-grey-100 p-1 text-grey-600",
              "transition-colors hover:bg-grey-200 focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-blue-400",
            )}
          >
            <IconSlot sizeClass="[&>svg]:size-6">{previewIcon}</IconSlot>
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(file)}
            aria-label={`Delete ${file.name}`}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg border border-red-200 bg-red-100 p-1 text-red-600",
              "transition-colors hover:bg-red-200 focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-red-400",
            )}
          >
            <IconSlot sizeClass="[&>svg]:size-6">{deleteIcon}</IconSlot>
          </button>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Upload                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * IFMIS file **Upload** control — a 300px field that walks through the
 * `default → uploading → error → uploaded` states from the design system.
 *
 * It is **presentational and controlled**: you own the upload logic and
 * drive `state`, `progress` and `files`; the component renders the matching
 * visuals and calls back on every action. Every label and icon is a prop,
 * so it adapts to any module (procurement, HR, payments…) without forking.
 *
 * Works in plain JavaScript / JSX — no TypeScript required.
 *
 * @example Minimal — let it manage the dropdown itself
 * ```jsx
 * <Upload
 *   label="Supporting documents"
 *   state="uploaded"
 *   files={files}
 *   onAddMore={pickFiles}
 *   onPreviewFile={(f) => window.open(urlFor(f.id))}
 *   onDeleteFile={(f) => removeFile(f.id)}
 * />
 * ```
 *
 * @example Wired to a real upload lifecycle
 * ```jsx
 * const [state, setState] = useState("default");
 * const [progress, setProgress] = useState(0);
 *
 * <Upload
 *   label="ID proof"
 *   hint="PDF up to 5 MB"
 *   state={state}
 *   progress={progress}
 *   files={files}
 *   onUpload={() => startUpload({ onProgress: setProgress })}
 *   onCancel={abortUpload}
 *   onRetry={startUpload}
 * />
 * ```
 *
 * @example Custom labels & icons (fully dynamic)
 * ```jsx
 * <Upload
 *   label="Attach invoice"
 *   labelIcon={<Receipt />}
 *   uploadLabel="Choose file"
 *   uploadIcon={<Paperclip />}
 *   addMoreLabel="Attach another"
 *   fileIcon={<FileXls />}
 * />
 * ```
 */
export const Upload = forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      state = "default",

      label = "Label",
      labelIcon = <User />,
      hint = "JPG, PNG, & PDFs",

      uploadLabel = "Upload",
      uploadIcon = <UploadSimple />,

      uploadingLabel = (p) => `Uploading - ${p}%`,
      uploadingIcon = <Spinner />,
      progress = 25,

      errorLabel = "Error Uploading",
      errorIcon = <Warning />,

      cancelLabel = "Cancel",
      retryLabel = "Retry",
      retryIcon = <ArrowCounterClockwise />,

      addMoreLabel = "Add More Files",
      addMoreIcon = <Plus />,

      fileIcon = <FilePdf />,
      previewIcon = <Eye />,
      deleteIcon = <Trash />,
      expandIcon = <CaretDown />,

      files = [],
      expanded,
      defaultExpanded = false,

      onUpload,
      onCancel,
      onRetry,
      onAddMore,
      onToggleExpand,
      onPreviewFile,
      onDeleteFile,
      className,
      ...props
    },
    ref,
  ) => {
    const labelId = useId();
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const isExpanded = expanded ?? internalExpanded;

    const toggleExpanded = () => {
      const next = !isExpanded;
      if (expanded === undefined) setInternalExpanded(next);
      onToggleExpand?.(next);
    };

    const primaryFile = files[0];

    return (
      <div
        ref={ref}
        className={cn("flex w-[300px] flex-col gap-3", className)}
        aria-labelledby={labelId}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-1.5 text-body-secondary">
          <IconSlot sizeClass="[&>svg]:size-5">{labelIcon}</IconSlot>
          <span
            id={labelId}
            className="whitespace-nowrap text-base font-normal leading-none"
          >
            {label}
          </span>
        </div>

        {/* Body */}
        <div className="flex w-full flex-col items-center justify-center gap-2">
          {state === "default" && (
            <>
              <PrimaryActionButton
                color="bg-purple-600"
                icon={uploadIcon}
                label={uploadLabel}
                onClick={onUpload}
              />
              <p className="self-start text-sm font-normal leading-tight text-body-secondary">
                {hint}
              </p>
            </>
          )}

          {state === "uploading" && (
            <>
              <PrimaryActionButton
                color="bg-blue-500"
                icon={uploadingIcon}
                spinning
                label={uploadingLabel(progress)}
                onClick={onUpload}
              />
              <div className="flex w-full items-center justify-between">
                <p className="text-sm font-normal leading-tight text-body-secondary">
                  {hint}
                </p>
                <PillButton label={cancelLabel} tone="grey" onClick={onCancel} />
              </div>
            </>
          )}

          {state === "error" && (
            <>
              <PrimaryActionButton
                color="bg-red-500"
                icon={errorIcon}
                label={errorLabel}
                onClick={onUpload}
              />
              <div className="flex w-full items-center justify-between">
                <p className="text-sm font-normal leading-tight text-body-secondary">
                  {hint}
                </p>
                <PillButton
                  label={retryLabel}
                  tone="purple"
                  icon={retryIcon}
                  onClick={onRetry}
                />
              </div>
            </>
          )}

          {state === "uploaded" && (
            <>
              <FileChip
                icon={primaryFile?.icon ?? fileIcon}
                name={primaryFile?.name ?? "file_name"}
                expanded={isExpanded}
                expandIcon={expandIcon}
                onToggle={toggleExpanded}
              />

              {isExpanded ? (
                <div className="flex w-full flex-col gap-3 rounded-2xl border border-surface-border-purple bg-white p-2">
                  {files.map((file) => (
                    <FileRow
                      key={file.id}
                      file={file}
                      fileIcon={fileIcon}
                      previewIcon={previewIcon}
                      deleteIcon={deleteIcon}
                      onPreview={onPreviewFile}
                      onDelete={onDeleteFile}
                    />
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onAddMore}
                  className={cn(
                    "flex h-11 w-full items-center justify-center gap-1.5 rounded-2xl bg-purple-600 px-2",
                    "text-sm font-semibold text-white transition-[filter] hover:brightness-110",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
                  )}
                >
                  <IconSlot sizeClass="[&>svg]:size-5">{addMoreIcon}</IconSlot>
                  <span className="whitespace-nowrap leading-none">
                    {addMoreLabel}
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  },
);

Upload.displayName = "Upload";
