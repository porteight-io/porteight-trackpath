"use client";

import {
  FullscreenIcon,
  HomeIcon,
  MenuListIcon,
  MenuToggleIcon,
  NotificationsIcon,
} from "./HeaderIcons";

/** .commonheader's shadow, verbatim. */
const HEADER_SHADOW =
  "2px 2px 4px -1px #0003, 2px 4px 5px #00000024, 2px 1px 5px #0000001f";

/** .page-name-menu runs green to blue; .page-name picks the trail up in teal. */
const TAB_GRADIENT = "linear-gradient(to right, #00a071, #194d94)";
const TRACE_GRADIENT = "linear-gradient(to right, #106c87, #194d94)";

/**
 * Shared chip box: 35px tall, 3px margin, 5px/24px padding. The extra right
 * padding clears the chevron notch. Body1 type at the app's 14px root.
 */
const tabBase =
  "relative m-[3px] flex h-[35px] w-max cursor-pointer items-center py-[5px] pl-[5px] pr-[24px] text-[14px] font-normal leading-[21px] tracking-[0.13132px] text-white";

export default function TopBar() {
  return (
    <header
      style={{ boxShadow: HEADER_SHADOW }}
      /*
       * .commonheader is fixed across the full viewport at z-index 1198, with
       * the 60px rail (z-index 1302) painting over its left end -- that is what
       * hides the shadow on that edge. .tool-bar is 54px tall with
       * margin-left 3rem (== 42px here) + padding-left 24px, so content sits
       * 66px in; padding-right is 14px.
       */
      className="fixed inset-x-0 top-0 z-[1198] flex h-[54px] min-h-[54px] items-center justify-between bg-white pl-[66px] pr-[14px] text-black"
    >
      <div className="flex items-center">
        {/* .page-name-menu declares no clip-path -- it is a plain rectangle. */}
        <div style={{ backgroundImage: TAB_GRADIENT }} className={tabBase}>
          {/* .screen_name: 13px, relative. */}
          <p className="relative whitespace-nowrap text-[length:var(--font-size-regular)]">
            {/*
             * .span-menu: relative, pointer, margin-right .5rem (7px here).
             * The label itself computes to 14px -- their `* { font-size: 14px }`
             * outranks .screen_name's 13px on this child.
             */}
            <span className="relative mr-[7px] cursor-pointer text-[14px]">
              <MenuListIcon size={19} className="mr-[5px] inline align-middle" />
              Vehicle Info
              {/*
               * The chevron is taken out of flow into the 24px right padding --
               * that is what `position: relative` here is for, and why the chip
               * measures 134.75px despite a full-size icon and a real gutter.
               */}
              <MenuToggleIcon className="absolute left-full top-1/2 ml-[12px] -translate-y-1/2" />
            </span>
          </p>
        </div>

        <div
          style={{ backgroundImage: TRACE_GRADIENT }}
          className={`tab-notch ${tabBase}`}
        >
          <p className="relative whitespace-nowrap text-[length:var(--font-size-regular)]">
            Trace
          </p>
        </div>
      </div>

      {/*
       * .global_filter_parrent: flex, centered, gap 16px. Its 166px width and
       * 42px height decompose exactly as 18 + 37 + 21 + 42 across four items,
       * the 42px avatar button setting the height.
       */}
      <div className="flex h-[42px] items-center gap-4">
        {/* Bare <img width="18">, not a button. */}
        <button
          type="button"
          title="Home"
          aria-label="Dashboard"
          className="cursor-pointer"
        >
          <HomeIcon size={18} />
        </button>

        {/* .header-fullscreen-btn drops MuiIconButton's padding: 21px, flush. */}
        <button
          type="button"
          aria-label="Fullscreen"
          className="cursor-pointer rounded-full"
        >
          <FullscreenIcon size={21} />
        </button>

        {/* MuiBadge wrapper, no padding of its own. */}
        <span className="relative inline-flex cursor-pointer align-middle">
          <NotificationsIcon size={21} />
        </span>

        {/*
         * MuiIconButton sizeSmall: 5px padding round the 32px avatar -> 42px,
         * set off from the icon trio by a further 16px. That extra margin is
         * what keeps the first three tight while the avatar sits apart.
         */}
        <button
          type="button"
          aria-haspopup="true"
          aria-label="Account"
          className="ml-4 cursor-pointer rounded-full p-[5px]"
        >
          {/* MuiAvatar colorDefault grey; MUI's 1.25rem == 17.5px at their root. */}
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#bdbdbd] text-[17.5px] font-normal text-white">
            C
          </span>
        </button>
      </div>
    </header>
  );
}
