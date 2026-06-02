import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Paperclip, Receipt } from "@phosphor-icons/react";
import { Upload, type UploadFile, type UploadState } from "./Upload";

/**
 * Storybook docs for the Upload control. The `description.component` block
 * below renders as the intro on the autodocs "Docs" tab, and each entry in
 * `argTypes` documents a prop in the controls table.
 */
const meta: Meta<typeof Upload> = {
  title: "UI/Upload",
  component: Upload,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A 300px file-upload field that moves through four states:",
          "`default → uploading → error → uploaded`.",
          "",
          "### How to use it",
          "`Upload` is **presentational and controlled** — it never uploads",
          "anything itself. You own the upload logic and drive `state`,",
          "`progress` and `files`; the component renders the matching visuals",
          "and calls back on every action.",
          "",
          "> Plain JavaScript / JSX — no TypeScript needed. Just import the",
          "> `Upload` component; you never import the `type` exports.",
          "",
          "```jsx",
          'import { useState } from "react";',
          'import { Upload } from "@ifmis/ui";',
          "",
          "function AttachmentField() {",
          '  const [state, setState] = useState("default");',
          "  const [progress, setProgress] = useState(0);",
          "  const [files, setFiles] = useState([]);",
          "",
          "  return (",
          "    <Upload",
          '      label="Supporting documents"',
          '      hint="PDF up to 5 MB"',
          "      state={state}",
          "      progress={progress}",
          "      files={files}",
          "      onUpload={() => startUpload({ onProgress: setProgress })}",
          "      onCancel={abortUpload}",
          "      onRetry={startUpload}",
          "      onAddMore={pickFiles}",
          "      onPreviewFile={(f) => window.open(urlFor(f.id))}",
          "      onDeleteFile={(f) => setFiles((cur) => cur.filter((x) => x.id !== f.id))}",
          "    />",
          "  );",
          "}",
          "```",
          "",
          "### Everything is dynamic",
          "Every label and icon is a prop (`label`, `labelIcon`, `uploadLabel`,",
          "`uploadIcon`, `addMoreLabel`, `fileIcon`, `previewIcon`, `deleteIcon`,",
          "…). Pass any icon node — Phosphor, lucide, or your own SVG — and the",
          "component sizes it for you. See the **Custom Labels & Icons** story.",
          "",
          "### Notes",
          "- The `uploaded` chip caret toggles the file dropdown. Leave",
          "  `expanded` unset to let the component manage it, or control it",
          "  with `expanded` + `onToggleExpand`.",
          "- Colours come from the design tokens and are intentionally fixed.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: ["default", "uploading", "error", "uploaded"],
      description:
        "Which visual state to render. Drive this from your upload lifecycle.",
      table: { defaultValue: { summary: "default" } },
    },
    label: { control: "text", description: "Field label above the control." },
    hint: {
      control: "text",
      description: "Helper text under/beside the button (e.g. accepted types).",
    },
    progress: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Upload progress 0–100, shown in the uploading label.",
    },
    uploadLabel: { control: "text", description: "Default button label." },
    addMoreLabel: { control: "text", description: "'Add More Files' label." },
    cancelLabel: { control: "text", description: "Cancel pill label." },
    retryLabel: { control: "text", description: "Retry pill label." },
    files: {
      control: false,
      description: "Files for the `uploaded` state. The first drives the chip.",
    },
    labelIcon: { control: false, description: "Icon before the label (`null` hides it)." },
    onUpload: { action: "upload" },
    onCancel: { action: "cancel" },
    onRetry: { action: "retry" },
    onAddMore: { action: "addMore" },
    onPreviewFile: { action: "previewFile" },
    onDeleteFile: { action: "deleteFile" },
  },
  args: {
    label: "Label",
    hint: "JPG, PNG, & PDFs",
    state: "default",
    progress: 25,
  },
};

export default meta;
type Story = StoryObj<typeof Upload>;

const FILES: UploadFile[] = [
  { id: "1", name: "file_name-2026" },
  { id: "2", name: "file_name-2026" },
];

export const Default: Story = {};
export const Uploading: Story = { args: { state: "uploading", progress: 25 } };
export const Error: Story = { args: { state: "error" } };

export const FileAdded: Story = {
  args: { state: "uploaded", files: FILES.slice(0, 1) },
};

export const MultipleFiles: Story = {
  args: { state: "uploaded", files: FILES, defaultExpanded: true },
};

/** Override any label or icon — the control adapts to your module. */
export const CustomLabelsAndIcons: Story = {
  args: {
    label: "Attach invoice",
    labelIcon: <Receipt />,
    uploadLabel: "Choose file",
    uploadIcon: <Paperclip />,
    hint: "XLSX or PDF",
  },
};

/** Every state stacked, matching the Figma overview frame. */
export const Showcase: Story = {
  render: () => {
    const rows: { title: string; node: React.ReactNode }[] = [
      { title: "Default", node: <Upload label="Label" state="default" /> },
      {
        title: "Uploading",
        node: <Upload label="Label" state="uploading" progress={25} />,
      },
      { title: "Error", node: <Upload label="Label" state="error" /> },
      {
        title: "Uploaded",
        node: (
          <Upload label="Label" state="uploaded" files={FILES.slice(0, 1)} />
        ),
      },
      {
        title: "Multiple files",
        node: (
          <Upload
            label="Label"
            state="uploaded"
            files={FILES}
            defaultExpanded
          />
        ),
      },
    ];
    return (
      <div className="flex flex-col gap-8">
        {rows.map((r) => (
          <div key={r.title} className="flex items-start gap-6">
            <span className="w-32 shrink-0 pt-2 text-heading text-lg font-semibold">
              {r.title}
            </span>
            {r.node}
          </div>
        ))}
      </div>
    );
  },
};

/** Interactive: run a fake upload through every state. */
function InteractiveDemo() {
  const [state, setState] = useState<UploadState>("default");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<UploadFile[]>([]);

  const run = () => {
    setState("uploading");
    setProgress(0);
    let p = 0;
    const timer = setInterval(() => {
      p += 25;
      setProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setFiles([{ id: crypto.randomUUID(), name: "file_name-2026" }]);
        setState("uploaded");
      }
    }, 400);
  };

  return (
    <Upload
      label="Label"
      state={state}
      progress={progress}
      files={files}
      onUpload={run}
      onCancel={() => setState("default")}
      onRetry={run}
      onAddMore={() =>
        setFiles((f) => [...f, { id: crypto.randomUUID(), name: "file_name-2026" }])
      }
      onDeleteFile={(file) =>
        setFiles((f) => f.filter((x) => x.id !== file.id))
      }
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
