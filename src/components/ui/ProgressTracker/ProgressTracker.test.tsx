import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ProgressTracker,
  type ActivityEntry,
  type ProgressTrackerProps,
  type ProgressTrackerTabId,
} from "./ProgressTracker";

const stages: ProgressTrackerProps["stages"] = [
  { id: "c", label: "Creator", status: "done" },
  { id: "v", label: "Verifier", status: "active" },
  { id: "a", label: "Approver", status: "pending" },
];

const timeline: ProgressTrackerProps["timeline"] = [
  { id: "c", name: "Mukesh Kumar", role: "Creator", status: "done", badge: { label: "Submitted", tone: "submitted" } },
  { id: "v", name: "Rahul Kumar", role: "Verifier", status: "active", badge: { label: "Pending", tone: "pending" } },
  { id: "a", name: "Animesh Sadh", role: "Approver", status: "pending" },
];

const tabs: ProgressTrackerProps["tabs"] = [
  { id: "remarks", label: "Remarks", count: 5 },
  { id: "comments", label: "Comments", count: 3 },
  { id: "files", label: "Files", count: 2 },
];

const entries: Partial<Record<ProgressTrackerTabId, ActivityEntry[]>> = {
  remarks: [
    { id: "r1", user: { name: "Mukesh Kumar" }, role: "Creator", status: { label: "Submitted", tone: "submitted" }, body: "A remark" },
  ],
  comments: [
    { id: "c1", user: { name: "Rahul Kumar" }, role: "Verifier", roleTone: "verifier", body: "A comment" },
  ],
  files: [
    { id: "f1", user: { name: "Animesh Sadh" }, role: "Approver", roleTone: "approver", files: [{ name: "a.pdf" }, { name: "b.pdf" }] },
  ],
};

describe("ProgressTracker", () => {
  it("renders the stage bar, timeline and the default (first) tab", () => {
    render(<ProgressTracker stages={stages} timeline={timeline} tabs={tabs} entries={entries} />);
    expect(screen.getByText("Stage Timeline")).toBeInTheDocument();
    expect(screen.getByText("Activity Log")).toBeInTheDocument();
    // Stage pills + timeline both show the names/labels.
    expect(screen.getAllByText("Creator").length).toBeGreaterThan(0);
    // Default tab is Remarks → its entry body shows.
    expect(screen.getByText("A remark")).toBeInTheDocument();
    expect(screen.queryByText("A comment")).not.toBeInTheDocument();
  });

  it("switches tabs (uncontrolled) and swaps the entry layout", async () => {
    render(<ProgressTracker stages={stages} timeline={timeline} tabs={tabs} entries={entries} />);
    await userEvent.click(screen.getByRole("tab", { name: /comments/i }));
    expect(screen.getByText("A comment")).toBeInTheDocument();
    expect(screen.queryByText("A remark")).not.toBeInTheDocument();
  });

  it("honours a controlled activeTab + onTabChange", async () => {
    const onTabChange = vi.fn();
    render(
      <ProgressTracker
        stages={stages}
        timeline={timeline}
        tabs={tabs}
        entries={entries}
        activeTab="files"
        onTabChange={onTabChange}
      />,
    );
    // Files entry with >1 file collapses into the "Multiple Files Attached" chip.
    expect(screen.getByText("Multiple Files Attached")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: /remarks/i }));
    expect(onTabChange).toHaveBeenCalledWith("remarks");
    // Controlled → stays on files until parent updates the prop.
    expect(screen.getByText("Multiple Files Attached")).toBeInTheDocument();
  });

  it("expands a collapsed multiple-files chip", async () => {
    render(
      <ProgressTracker stages={stages} timeline={timeline} tabs={tabs} entries={entries} activeTab="files" />,
    );
    expect(screen.queryByText("a.pdf")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /multiple files attached/i }));
    expect(screen.getByText("a.pdf")).toBeInTheDocument();
    expect(screen.getByText("b.pdf")).toBeInTheDocument();
  });
});
