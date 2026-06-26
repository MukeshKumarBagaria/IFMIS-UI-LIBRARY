import type { Meta, StoryObj } from "@storybook/react";
import {
  ProgressTracker,
  type ActivityEntry,
  type ProgressTrackerProps,
  type ProgressTrackerTabId,
} from "./ProgressTracker";

const LOREM =
  "Lorem ipsum dolor sit amet consectetur. Mauris vulputate tortor mus quam vel lorem dolor dignissim.";

const STAGES: ProgressTrackerProps["stages"] = [
  { id: "creator", label: "Creator", status: "done" },
  { id: "verifier", label: "Verifier", status: "active" },
  { id: "approver", label: "Approver", status: "pending" },
];

const TIMELINE: ProgressTrackerProps["timeline"] = [
  {
    id: "creator",
    name: "Mukesh Kumar",
    role: "Creator",
    timestamp: "28 May 2026, 11:00 AM",
    status: "done",
    badge: { label: "Submitted", tone: "submitted" },
  },
  {
    id: "verifier",
    name: "Rahul Kumar",
    role: "Verifier",
    timestamp: "28 May 2026, 11:00 AM",
    status: "active",
    badge: { label: "Pending", tone: "pending" },
  },
  {
    id: "approver",
    name: "Animesh Sadh",
    role: "Approver",
    status: "pending",
  },
];

const TABS: ProgressTrackerProps["tabs"] = [
  { id: "remarks", label: "Remarks", count: 5 },
  { id: "comments", label: "Comments", count: 3 },
  { id: "files", label: "Files", count: 2 },
];

const FILE = (name = "File_one.pdf") => ({ name, onPreview: () => {}, onDownload: () => {} });

const ENTRIES: Partial<Record<ProgressTrackerTabId, ActivityEntry[]>> = {
  remarks: [
    {
      id: "r1",
      user: { name: "Mukesh Kumar" },
      role: "Creator",
      roleTone: "creator",
      status: { label: "Submitted", tone: "submitted" },
      body: LOREM,
      files: [FILE()],
      timestamp: "24 May 2026, 09:00 AM",
    },
    {
      id: "r2",
      user: { name: "Rahul Kumar" },
      role: "Verifier",
      roleTone: "verifier",
      status: { label: "Return", tone: "return" },
    },
  ],
  comments: [
    {
      id: "c1",
      user: { name: "Rahul Kumar" },
      role: "Verifier",
      roleTone: "verifier",
      body: LOREM,
      files: [FILE()],
      timestamp: "24 May 2026, 09:00 AM",
      align: "right",
    },
    {
      id: "c2",
      user: { name: "Animesh Sadh" },
      role: "Approver",
      roleTone: "approver",
      body: LOREM,
      align: "left",
    },
  ],
  files: [
    {
      id: "f1",
      user: { name: "Rahul Kumar" },
      role: "Verifier",
      roleTone: "verifier",
      files: [FILE()],
      collapseFiles: false,
      timestamp: "24 May 2026, 09:00 AM",
    },
    {
      id: "f2",
      user: { name: "Animesh Sadh" },
      role: "Approver",
      roleTone: "approver",
      files: [FILE("File_one.pdf"), FILE("File_two.pdf"), FILE("File_three.pdf")],
      collapseFiles: true,
      timestamp: "24 May 2026, 09:00 AM",
    },
    {
      id: "f3",
      user: { name: "Mukesh Kumar" },
      role: "Creator",
      roleTone: "creator",
      files: [FILE()],
      collapseFiles: false,
      timestamp: "24 May 2026, 09:00 AM",
    },
  ],
};

const meta: Meta<typeof ProgressTracker> = {
  title: "UI/ProgressTracker",
  component: ProgressTracker,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "The IFMIS workflow tracker: a connected stage pill bar, a Stage",
          "Timeline rail, and a tabbed Activity Log (Remarks / Comments / Files).",
          "Switch the tab to change the activity layout — tinted status cards,",
          "aligned comment bubbles, or compact file rows.",
        ].join("\n"),
      },
    },
  },
  args: {
    stages: STAGES,
    timeline: TIMELINE,
    tabs: TABS,
    entries: ENTRIES,
  },
};

export default meta;
type Story = StoryObj<typeof ProgressTracker>;

/** Remarks tab active — matches the Figma `Type=Remarks` variant. */
export const Remarks: Story = { args: { defaultTab: "remarks" } };

/** Comments tab active — `Type=Comments` variant (aligned bubbles). */
export const Comments: Story = { args: { defaultTab: "comments" } };

/** Files tab active — `Type=Files` variant (file rows). */
export const Files: Story = { args: { defaultTab: "files" } };
