import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/cn";

export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Brand area — rendered on the left.
   * Typically `<HeaderBrand />`, but any node is allowed.
   */
  brand?: ReactNode;
  /**
   * Actions area — rendered on the right.
   * Typically a horizontal stack of the action sub-components
   * (`<AccessibilityMenu />`, `<LanguageToggle />`, `<FontSizeControl />`,
   * `<NotificationButton />`, `<ProfileMenu />`).
   */
  actions?: ReactNode;
  /**
   * Optional bitmap rendered **behind** the brand purple gradient.
   * The library does not bundle a default — consumers ship their own
   * image and pass its URL here. When omitted, only the gradient renders
   * (still on-brand).
   *
   * @example
   *   import headerBg from "@/assets/header-bg.png";
   *   <Header backgroundImage={headerBg} ... />
   */
  backgroundImage?: string;
  /**
   * Free-form content inserted between brand and actions, for screens that
   * need a centred element (search bar, breadcrumbs). Most apps leave this
   * empty.
   */
  children?: ReactNode;
}

/**
 * `Header` is the page chrome that frames every screen in IFMIS apps.
 *
 * It owns the gradient background, the safe-area padding, and the
 * brand/actions layout. The visible content is plugged in via the
 * `brand` and `actions` slots so individual products can compose only
 * the parts they need.
 *
 * @example Minimum
 *   <Header
 *     brand={<HeaderBrand title="IFMIS" subtitle="Government of India" />}
 *     actions={<ProfileMenu user={user} />}
 *   />
 *
 * @example Full row
 *   <Header
 *     brand={<HeaderBrand title="..." subtitle="..." />}
 *     actions={
 *       <HeaderActions>
 *         <AccessibilityMenu />
 *         <LanguageToggle value={lang} onChange={setLang} options={LANGS} />
 *         <FontSizeControl value={size} onChange={setSize} />
 *         <NotificationButton count={5} />
 *         <ProfileMenu user={user} onLogout={logout} />
 *       </HeaderActions>
 *     }
 *   />
 */
export const Header = forwardRef<HTMLElement, HeaderProps>(
  (
    { brand, actions, backgroundImage, children, className, style, ...props },
    ref,
  ) => {
    const gradient =
      "linear-gradient(90deg, rgba(143, 26, 229, 0.75) 0%, rgba(56, 10, 92, 0.75) 100%)";
    const bg = backgroundImage
      ? { backgroundImage: `${gradient}, url(${backgroundImage})` }
      : { backgroundImage: gradient };

    return (
      <header
        ref={ref}
        className={cn(
          /**
           * Header itself is `position: relative` (so absolutely-positioned
           * popovers like ProfileDropdown anchor to it) and a stacking
           * context (`z-30`) that sits above page content but below
           * site-wide modals (`z-50+`). We deliberately do **not** clip
           * with `overflow-hidden` — popovers must escape downward.
           */
          "relative isolate z-30 w-full h-20",
          "bg-cover bg-center bg-no-repeat",
          className,
        )}
        style={{ ...bg, ...style }}
        {...props}
      >
        <div
          className={cn(
            "box-border flex h-[57px] items-center justify-between",
            "mx-6 my-3",
          )}
        >
          <div className="flex items-center min-w-0">{brand}</div>
          {children ? <div className="flex items-center">{children}</div> : null}
          <div className="flex items-center">{actions}</div>
        </div>
      </header>
    );
  },
);

Header.displayName = "Header";

/**
 * `HeaderActions` is a thin layout primitive — a flex row with the
 * canonical 16px gap between action items. Use it inside `Header.actions`
 * to keep spacing consistent across products.
 */
export interface HeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Override the canonical 16px gap. Accepts any Tailwind gap utility. */
  gapClassName?: string;
}

export const HeaderActions = forwardRef<HTMLDivElement, HeaderActionsProps>(
  ({ className, gapClassName = "gap-4", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center", gapClassName, className)}
      {...props}
    >
      {children}
    </div>
  ),
);

HeaderActions.displayName = "HeaderActions";
