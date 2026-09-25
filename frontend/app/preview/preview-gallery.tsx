"use client";

import { useState } from "react";
import Link from "next/link";
import { AssetsScreen } from "../screens/assets-screen";
import { DiscoverScreen } from "../screens/discover-screen";
import { FuturesScreen } from "../screens/futures-screen";
import { HomeScreen } from "../screens/home-screen";
import { MarketsScreen } from "../screens/markets-screen";
import { SettingsScreen } from "../screens/settings-screen";
import { SmartMoneyScreen } from "../screens/smart-money-screen";
import { SpotScreen } from "../screens/spot-screen";
import { SquareScreen } from "../screens/square-screen";
import { SwapScreen } from "../screens/swap-screen";
import { WalletConnectScreen } from "../screens/wallet-connect-screen";
import { WalletHomeScreen } from "../screens/wallet-home-screen";
import { WalletSplashScreen } from "../screens/wallet-splash-screen";

const SCREENS = {
  Home: HomeScreen,
  Markets: MarketsScreen,
  Spot: SpotScreen,
  Futures: FuturesScreen,
  Assets: AssetsScreen,
  "Wallet Home": WalletHomeScreen,
  Discover: DiscoverScreen,
  Swap: SwapScreen,
  Square: SquareScreen,
  "Smart Money": SmartMoneyScreen,
  Settings: SettingsScreen,
  "Wallet Splash": WalletSplashScreen,
  "Wallet Connect": WalletConnectScreen,
} as const;

type ScreenName = keyof typeof SCREENS;

export function PreviewGallery() {
  const [selected, setSelected] = useState<ScreenName | null>(null);
  const Screen = selected ? SCREENS[selected] : null;

  if (Screen) {
    return <div className="min-h-dvh bg-[#0b0e11] py-8"><div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[2rem] border border-line bg-bg shadow-2xl shadow-black"><button onClick={() => setSelected(null)} className="m-3 self-start rounded-lg bg-surface2 px-3 py-2 text-sm text-text">← All pages</button><main className="app-scroll min-h-0 flex-1 overflow-y-auto"><Screen /></main></div></div>;
  }

  return <main className="min-h-dvh bg-[#0b0e11] px-4 py-8 text-text"><div className="mx-auto max-w-3xl"><h1 className="text-3xl font-bold">All Binance screens</h1><p className="mt-2 text-muted">Every page from the supplied frontend bundle is available here.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{(Object.keys(SCREENS) as ScreenName[]).map((name) => <button key={name} onClick={() => setSelected(name)} className="flex items-center justify-between rounded-xl bg-surface p-4 text-left transition-colors hover:bg-surface2"><span><b className="block">{name}</b><small className="text-muted">Open full-screen preview</small></span><span className="text-xl text-yellow">›</span></button>)}</div><Link href="/" className="mt-8 inline-block text-sm text-yellow">← Return to the main app</Link></div></main>;
}
