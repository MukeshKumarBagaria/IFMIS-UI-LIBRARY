import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";
import { CaretDown, Gear, SignOut, UserCircle } from "@phosphor-icons/react";
import { cn } from "../../../../lib/cn";
import { GlassButton } from "./GlassPill";
import { RoleBadge, type RoleVariant } from "./RoleBadge";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ProfileRole {
  variant: RoleVariant;
  /** Optional label override (defaults to English label for the variant). */
  label?: string;
}

export interface ProfileLastLogin {
  /** Date label, e.g. `"19 Jan, 2026"`. */
  date: string;
  /**
   * Optional time. Rendered in the destructive/red accent inside the
   * dropdown to draw attention to recent activity.
   */
  time?: string;
}

export interface ProfileUser {
  /** Display name on the **trigger** pill. */
  name: string;
  /** Sub-label under the name on the trigger pill. */
  designation?: string;
  /** Avatar URL — used only on the trigger. */
  avatarUrl?: string;
  /** Initials shown when the image fails / is omitted. Defaults to first letters of `name`. */
  initials?: string;
  /** Roles granted to the user — rendered as colour badges in the dropdown. */
  roles?: ProfileRole[];
  /**
   * Employee / staff identifier (e.g. `"0000442105"`). When present the
   * dropdown identity card renders `${designation}-${employeeId}` as the
   * primary line.
   */
  employeeId?: string;
  /**
   * Organisation / department / branch. Rendered uppercase under the
   * primary line in the dropdown identity card.
   */
  organisation?: string;
  /** Last login info shown at the bottom of the identity card. */
  lastLogin?: ProfileLastLogin;
}

export interface ProfileMenuLabels {
  /** Trigger / accessible name. Default `"Profile"`. */
  trigger?: string;
  /** Header above the role list. Default `"Assigned Roles"`. */
  rolesHeading?: string;
  /** Prefix in front of the last-login date. Default `"Last Login:"`. */
  lastLoginPrefix?: string;
  /** Settings action label. Default `"Settings"`. */
  settings?: string;
  /** Logout action label. Default `"Logout"`. */
  logout?: string;
}

export interface ProfileMenuProps {
  user: ProfileUser;
  /** Visible labels — i18n-ready. */
  labels?: ProfileMenuLabels;
  /** Click handler for the settings action. Hides the action when omitted. */
  onSettings?: () => void;
  /** Click handler for the logout action. Hides the action when omitted. */
  onLogout?: () => void;
  /** Controlled `open` state. When set, the host owns open/close. */
  open?: boolean;
  /** Controlled change handler. Required when `open` is provided. */
  onOpenChange?: (open: boolean) => void;
  /** Extra content rendered inside the dropdown, above the action row. */
  children?: ReactNode;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const DEFAULT_LABELS: Required<ProfileMenuLabels> = {
  trigger: "Profile",
  rolesHeading: "Assigned Roles",
  lastLoginPrefix: "Last Login:",
  settings: "Settings",
  logout: "Logout",
};

function computeInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                     */
/* -------------------------------------------------------------------------- */

interface AvatarProps {
  user: ProfileUser;
  /** Pixel size of the avatar circle. */
  size: number;
  /** Background variant — `"glass"` for the trigger, `"surface"` for the dropdown. */
  variant?: "glass" | "surface";
}

function Avatar({ user, size, variant = "glass" }: AvatarProps) {
  const initials = user.initials ?? computeInitials(user.name);
  const baseClass = cn(
    "flex shrink-0 items-center justify-center rounded-full overflow-hidden",
    variant === "glass"
      ? "bg-white/20 text-white"
      : "bg-purple-100 text-purple-800",
  );

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        width={size}
        height={size}
        className={cn(baseClass, "object-cover")}
        draggable={false}
      />
    );
  }

  if (initials) {
    return (
      <span
        aria-hidden
        className={cn(baseClass, "font-sans font-semibold")}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      >
        {initials}
      </span>
    );
  }

  return (
    <span aria-hidden className={baseClass} style={{ width: size, height: size }}>
      <UserCircle size={size} weight="regular" />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* ProfileDropdown — the floating card                                        */
/* -------------------------------------------------------------------------- */

interface ProfileDropdownProps {
  user: ProfileUser;
  labels: Required<ProfileMenuLabels>;
  onSettings?: () => void;
  onLogout?: () => void;
  children?: ReactNode;
  id?: string;
  /** Inline style — used by the portal wrapper to set `fixed` positioning. */
  style?: CSSProperties;
}

const ProfileDropdown = forwardRef<HTMLDivElement, ProfileDropdownProps>(
  ({ user, labels, onSettings, onLogout, children, id, style }, ref) => {
    return (
      <div
        ref={ref}
        id={id}
        role="menu"
        aria-label={labels.trigger}
        className={cn(
          "z-[1000]",
          "flex w-[calc(100vw-1rem)] max-w-[400px] flex-col items-start gap-4 p-3",
          "rounded-3xl border border-surface-border-purple",
          "backdrop-blur-[6px] shadow-[0_8px_24px_-8px_rgba(36,4,61,0.35)]",
        )}
        style={{ backgroundColor: "rgba(250, 247, 253, 0.75)", ...style }}
      >
        {/* Identity card */}
        <div
          className={cn(
            "flex w-full flex-col items-start gap-2 p-3 rounded-2xl",
            "border border-surface-border-purple",
          )}
          style={{ backgroundColor: "rgba(243, 236, 250, 0.50)" }}
        >
          <span className="font-sans font-semibold text-[16px] leading-tight text-heading">
            {user.employeeId
              ? `${user.designation ?? user.name}-${user.employeeId}`
              : (user.designation ?? user.name)}
          </span>
          {user.organisation ? (
            <span className="font-sans font-semibold text-[14px] leading-tight text-heading uppercase tracking-wide">
              {user.organisation}
            </span>
          ) : null}
          {user.lastLogin ? (
            <span className="font-sans text-[14px] leading-tight text-body-primary">
              {labels.lastLoginPrefix} {user.lastLogin.date}
              {user.lastLogin.time ? (
                <>
                  {" "}
                  <span className="font-semibold text-destructive">
                    {user.lastLogin.time}
                  </span>
                </>
              ) : null}
            </span>
          ) : null}
        </div>

        {user.roles && user.roles.length > 0 ? (
          <div className="flex w-full flex-col gap-2 px-1">
            <span className="font-sans font-semibold text-[16px] leading-none text-heading">
              {labels.rolesHeading}
            </span>
            <div className="flex w-full items-stretch gap-2">
              {user.roles.map((role, index) => (
                <RoleBadge
                  key={`${role.variant}-${index}`}
                  variant={role.variant}
                  label={role.label}
                  className="flex-1 justify-center"
                />
              ))}
            </div>
          </div>
        ) : null}

        {children}

        {(onSettings || onLogout) && (
          <div className="flex w-full items-center gap-2">
            {onSettings ? (
              <button
                type="button"
                role="menuitem"
                onClick={onSettings}
                className={cn(
                  "flex w-[120px] items-center justify-center gap-1.5 px-3 py-2",
                  "rounded-2xl border border-surface-border-grey bg-surface-grey-bg",
                  "font-sans font-semibold text-[14px] leading-none text-body-primary",
                  "transition-colors hover:bg-grey-100",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <Gear size={16} weight="regular" aria-hidden />
                {labels.settings}
              </button>
            ) : null}
            {onLogout ? (
              <button
                type="button"
                role="menuitem"
                onClick={onLogout}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 px-3 py-2",
                  "rounded-2xl border border-red-200 bg-red-100 text-red-800",
                  "font-sans font-semibold text-[14px] leading-none",
                  "transition-colors hover:bg-red-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive",
                )}
              >
                <SignOut size={16} weight="regular" aria-hidden />
                {labels.logout}
              </button>
            ) : null}
          </div>
        )}
      </div>
    );
  },
);

ProfileDropdown.displayName = "ProfileDropdown";

/* -------------------------------------------------------------------------- */
/* ProfileMenu — trigger + dropdown                                           */
/* -------------------------------------------------------------------------- */

/**
 * `ProfileMenu` — the trailing pill on the header.
 *
 * Renders the avatar + name pill that opens a 400px dropdown card with
 * the user's profile, assigned roles, and the Settings + Logout actions.
 *
 * - Controlled or uncontrolled (`open` + `onOpenChange`).
 * - Closes on outside click and `Escape`.
 * - All labels are i18n-ready via the `labels` prop.
 * - Hide an action by omitting its handler (`onSettings`, `onLogout`).
 *
 * @example
 *   <ProfileMenu
 *     user={{
 *       name: "Mukesh Kumar",
 *       designation: "Block Programme Officer",
 *       roles: [{ variant: "creator" }, { variant: "verifier" }],
 *     }}
 *     onSettings={() => navigate("/settings")}
 *     onLogout={() => signOut()}
 *   />
 */
export const ProfileMenu = forwardRef<HTMLDivElement, ProfileMenuProps>(
  (
    {
      user,
      labels,
      onSettings,
      onLogout,
      open: openProp,
      onOpenChange,
      children,
      className,
    },
    ref,
  ) => {
    const isControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isControlled ? openProp : internalOpen;

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const dropdownId = useId();
    const resolvedLabels = { ...DEFAULT_LABELS, ...labels };

    /**
     * `position` is the viewport-relative anchor for the dropdown. The
     * dropdown is rendered through a portal into `document.body` and
     * positioned with `fixed`, so it cannot be clipped by any ancestor
     * `overflow: hidden` / `transform` / `contain` container.
     */
    const [position, setPosition] = useState<{ top: number; right: number } | null>(null);

    const updatePosition = useCallback(() => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    }, []);

    useLayoutEffect(() => {
      if (!open) return;
      updatePosition();
    }, [open, updatePosition]);

    useEffect(() => {
      if (!open) return;

      const handlePointer = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          wrapperRef.current?.contains(target) ||
          dropdownRef.current?.contains(target)
        ) {
          return;
        }
        setOpen(false);
      };
      const handleKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false);
      };
      const handleViewport = () => updatePosition();

      document.addEventListener("mousedown", handlePointer);
      document.addEventListener("keydown", handleKey);
      window.addEventListener("scroll", handleViewport, true);
      window.addEventListener("resize", handleViewport);
      return () => {
        document.removeEventListener("mousedown", handlePointer);
        document.removeEventListener("keydown", handleKey);
        window.removeEventListener("scroll", handleViewport, true);
        window.removeEventListener("resize", handleViewport);
      };
    }, [open, setOpen, updatePosition]);

    return (
      <div
        ref={(node) => {
          wrapperRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn("relative", className)}
      >
        <GlassButton
          ref={triggerRef}
          shape="pill"
          aria-label={resolvedLabels.trigger}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? dropdownId : undefined}
          onClick={() => setOpen(!open)}
          className="h-[50px] gap-2 sm:gap-3 px-2 sm:px-3"
        >
          <Avatar user={user} size={32} variant="glass" />
          <div className="hidden sm:flex min-w-0 flex-col items-start">
            <span className="font-sans font-semibold text-[14px] leading-none text-white truncate max-w-[120px] lg:max-w-[160px]">
              {user.name}
            </span>
            {user.designation ? (
              <span className="hidden lg:block font-sans text-[12px] leading-none text-neutral-100 truncate max-w-[160px] mt-1">
                {user.designation}
              </span>
            ) : null}
          </div>
          <CaretDown
            size={16}
            weight="bold"
            aria-hidden
            className={cn("hidden sm:block transition-transform", open && "rotate-180")}
          />
        </GlassButton>

        {open && typeof document !== "undefined"
          ? createPortal(
              <ProfileDropdown
                ref={dropdownRef}
                id={dropdownId}
                user={user}
                labels={resolvedLabels}
                style={{
                  position: "fixed",
                  top: position?.top ?? -9999,
                  right: position?.right ?? 0,
                  visibility: position ? "visible" : "hidden",
                }}
                onSettings={
                  onSettings
                    ? () => {
                        onSettings();
                        setOpen(false);
                      }
                    : undefined
                }
                onLogout={
                  onLogout
                    ? () => {
                        onLogout();
                        setOpen(false);
                      }
                    : undefined
                }
              >
                {children}
              </ProfileDropdown>,
              document.body,
            )
          : null}
      </div>
    );
  },
);

ProfileMenu.displayName = "ProfileMenu";
