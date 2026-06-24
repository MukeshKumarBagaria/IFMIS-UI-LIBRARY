# Upload

> A file-upload field that walks through four visual states (`default → uploading → error → uploaded`). **Presentational and controlled** — it never uploads anything; you own the upload logic and drive `state`/`progress`/`files`, and it renders the matching visuals and calls back on every action. Every label and icon is a prop.

```jsx
import { Upload } from "@ifmis/ui";
```

- **Type:** File-upload control (`<div>`, fixed 300px wide). `ref` forwards to the wrapper.
- **Types:** `UploadProps`, `UploadState` (`"default" | "uploading" | "error" | "uploaded"`), `UploadFile`.

---

## Purpose

Render the design-system upload field for whatever upload lifecycle your app implements. It's a pure view of `state` — it does not transition on its own.

## When to use

- An attachment/document upload field in a form, where you manage the actual upload.

## When NOT to use

- You need the component to perform the upload itself — it doesn't; wire your own XHR/fetch.
- A plain text/number input → use [`TextField`](TextField.md).

## States

| `state` | Shows |
| --- | --- |
| `default` | The upload call-to-action button + format hint. |
| `uploading` | Blue progress button (from `progress`) + Cancel pill. |
| `error` | Red error button + Retry pill. |
| `uploaded` | File chip with a caret. Collapsed → "Add More Files"; expanded → dropdown list of files with preview (eye) + delete (trash). |

You decide which state to show based on your lifecycle.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `state` | `"default" \| "uploading" \| "error" \| "uploaded"` | `"default"` | Which visual to render. |
| `label` | `ReactNode` | `"Label"` | Field header text. |
| `labelIcon` | `ReactNode \| null` | user glyph | Icon before the label; `null` hides it. |
| `hint` | `ReactNode` | `"JPG, PNG, & PDFs"` | Helper text (accepted types / size). |
| `progress` | `number` | `25` | 0–100, fed to `uploadingLabel`. |
| `uploadingLabel` | `(progress: number) => ReactNode` | `Uploading - p%` | Builds the uploading text. |
| `files` | `UploadFile[]` | `[]` | Listed in `uploaded`; the first drives the chip. |
| `expanded` | `boolean` | — | Control the dropdown (omit to self-manage). |
| `defaultExpanded` | `boolean` | `false` | Initial expanded value when uncontrolled. |
| `onUpload` | `() => void` | — | Primary upload button. |
| `onCancel` | `() => void` | — | Cancel (uploading). |
| `onRetry` | `() => void` | — | Retry (error). |
| `onAddMore` | `() => void` | — | "Add More Files" (uploaded, collapsed). |
| `onToggleExpand` | `(expanded: boolean) => void` | — | Caret toggle. |
| `onPreviewFile` | `(file: UploadFile) => void` | — | Per-file preview (eye). |
| `onDeleteFile` | `(file: UploadFile) => void` | — | Per-file delete (trash). |
| `uploadLabel`/`uploadIcon`/`errorLabel`/`errorIcon`/`cancelLabel`/`retryLabel`/`retryIcon`/`addMoreLabel`/`addMoreIcon`/`fileIcon`/`previewIcon`/`deleteIcon`/`expandIcon`/`uploadingIcon` | `ReactNode` | sensible | Every label/icon is overridable. |
| `className` | `string` | — | Merged onto the field wrapper. |

`UploadFile` = `{ id: string; name: string; icon?: ReactNode }`. Other native `<div>` props are forwarded (`onError` omitted).

## Usage examples

### Wired to a real upload lifecycle

```jsx
const [state, setState] = useState("default");
const [progress, setProgress] = useState(0);
const [files, setFiles] = useState([]);

async function start() {
  setState("uploading");
  try {
    const file = await uploadWithProgress({ onProgress: setProgress });
    setFiles((cur) => [...cur, file]);
    setState("uploaded");
  } catch {
    setState("error");
  }
}

<Upload
  label="Supporting documents"
  hint="PDF up to 5 MB"
  state={state}
  progress={progress}
  files={files}
  onUpload={start}
  onCancel={() => setState("default")}
  onRetry={start}
  onAddMore={start}
  onPreviewFile={(f) => window.open(urlFor(f.id))}
  onDeleteFile={(f) => setFiles((cur) => cur.filter((x) => x.id !== f.id))}
/>
```

### Uploaded state + dropdown (controlled)

```jsx
const [open, setOpen] = useState(false);
<Upload state="uploaded" files={files} expanded={open} onToggleExpand={setOpen} />
```

### Custom labels & icons

```jsx
import { Receipt, Paperclip } from "@phosphor-icons/react";

<Upload
  label="Attach invoice"
  labelIcon={<Receipt />}
  uploadLabel="Choose file"
  uploadIcon={<Paperclip />}
  addMoreLabel="Attach another"
  hint="XLSX or PDF"
/>
```

### Width override

```jsx
<Upload className="w-full" state="default" />     {/* fill the column */}
<Upload className="max-w-sm" state="default" />
```

## Best practices

- **Own the lifecycle** — flip `state` and feed `progress` yourself; the component won't transition automatically.
- **Use stable per-file `id`s** — `onPreviewFile`/`onDeleteFile` hand back the `UploadFile`; key your data off `file.id`, not the index.
- Set a real `hint` (accepted types + size limit) to avoid error states.
- Keep `files` in sync with the server (optimistic delete + rollback, or after confirmation).

## Common mistakes

- **Expecting it to upload** — it's presentational; wire your own request.
- **Keying file data by index** — use `file.id`.
- **Forgetting to set `state`** — it stays in `default` unless you drive it.

## Accessibility

- The field is labelled — the visible `label` is wired via `aria-labelledby`.
- The dropdown caret exposes `aria-expanded`; preview/delete buttons have descriptive `aria-label`s (`Preview <name>`, `Delete <name>`).
- Every interactive element is a real `<button>` with a visible focus ring.

## Related components

- [`TextField`](TextField.md) — text input.
- [`FormField`](FormField.md) — field shell for custom controls.
- [`Button`](Button.md) — generic actions.
