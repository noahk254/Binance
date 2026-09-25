"use client";

import { useState } from "react";
import { BottomNav, TabKey } from "./components/bottom-nav";
import { HomeScreen } from "./screens/home-screen";
import { MarketsScreen } from "./screens/markets-screen";
import { SpotScreen } from "./screens/spot-screen";
import { FuturesScreen } from "./screens/futures-screen";
import { AssetsScreen } from "./screens/assets-screen";
import { WalletHomeScreen } from "./screens/wallet-home-screen";
import { DiscoverScreen } from "./screens/discover-screen";
import { SwapScreen } from "./screens/swap-screen";
import { SquareScreen } from "./screens/square-screen";
import { SmartMoneyScreen } from "./screens/smart-money-screen";
import { SettingsScreen } from "./screens/settings-screen";
import { WalletSplashScreen } from "./screens/wallet-splash-screen";
import { WalletConnectScreen } from "./screens/wallet-connect-screen";

const SCREENS: Record<TabKey, () => React.JSX.Element> = {
  Home: HomeScreen,
  Markets: MarketsScreen,
  Trade: SpotScreen,
  Futures: FuturesScreen,
  Assets: AssetsScreen,
};

type ExperienceKey = TabKey | "Wallet" | "Wallet Splash" | "Wallet Connect" | "Discover" | "Swap" | "Square" | "Smart Money" | "Settings";

const EXTRA_SCREENS: Record<Exclude<ExperienceKey, TabKey>, () => React.JSX.Element> = {
  Wallet: WalletHomeScreen,
  "Wallet Splash": WalletSplashScreen,
  "Wallet Connect": () => <WalletConnectScreen />,
  Discover: DiscoverScreen,
  Swap: SwapScreen,
  Square: () => <SquareScreen />,
  "Smart Money": () => <SmartMoneyScreen />,
  Settings: () => <SettingsScreen />,
};

const EXPERIENCES = Object.keys(EXTRA_SCREENS) as Array<Exclude<ExperienceKey, TabKey>>;

export default function Page() {
  const [view, setView] = useState<ExperienceKey>("Home");
  const [showExplorer, setShowExplorer] = useState(false);
  const isMainTab = view in SCREENS;
  const Screen = isMainTab ? SCREENS[view as TabKey] : EXTRA_SCREENS[view as Exclude<ExperienceKey, TabKey>];

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0b0e11] sm:py-8">
      <div
        className="app-scroll relative flex h-dvh w-full flex-col overflow-hidden bg-bg sm:h-[min(92dvh,900px)] sm:max-w-[430px] sm:rounded-[2rem] sm:border sm:border-line sm:shadow-2xl sm:shadow-black"
      >
        <main className="app-scroll min-h-0 flex-1 overflow-y-auto">
          {!isMainTab ? <button onClick={() => setShowExplorer(true)} className="mx-4 mt-3 rounded-md bg-surface2 px-3 py-1.5 text-xs text-muted">‹ All experiences</button> : null}
          <Screen />
        </main>
        {isMainTab ? <BottomNav active={view as TabKey} onChange={setView} /> : null}
        {showExplorer ? <div className="absolute inset-0 z-10 overflow-y-auto bg-bg p-5"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Explore experiences</h1><button onClick={() => setShowExplorer(false)} className="rounded-lg bg-surface2 px-3 py-2 text-sm">Close</button></div><p className="mt-2 text-sm text-muted">New wallet and community screens from the supplied frontend bundle.</p><div className="mt-5 grid gap-3">{EXPERIENCES.map((name) => <button key={name} onClick={() => { setView(name); setShowExplorer(false); }} className="flex items-center justify-between rounded-xl bg-surface p-4 text-left transition-colors hover:bg-surface2"><span><b className="block text-text">{name}</b><small className="text-muted">Open experience</small></span><span className="text-xl text-yellow">›</span></button>)}</div></div> : null}
      </div>
    </div>
  );
}
