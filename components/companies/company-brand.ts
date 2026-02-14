import {
  AirbnbIcon,
  AmazonIcon,
  AppleIcon,
  DropboxIcon,
  FigmaIcon,
  GithubIcon,
  GitlabIcon,
  GoogleIcon,
  MetaIcon,
  MicrosoftIcon,
  NotionIcon,
  PaypalIcon,
  ShopifyIcon,
  SlackIcon,
  SpotifyIcon,
  StripeIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type ComponentProps } from "react"

type CompanyBrandPresentation = {
  icon?: ComponentProps<typeof HugeiconsIcon>["icon"]
  className: string
  fallback: string
}

const COMPANY_BRAND_BY_ID: Record<string, CompanyBrandPresentation> = {
  airbnb: { icon: AirbnbIcon, className: "bg-rose-600 text-white", fallback: "A" },
  amazon: { icon: AmazonIcon, className: "bg-orange-600 text-white", fallback: "A" },
  apple: { icon: AppleIcon, className: "bg-zinc-900 text-white", fallback: "A" },
  dropbox: { icon: DropboxIcon, className: "bg-blue-600 text-white", fallback: "D" },
  figma: { icon: FigmaIcon, className: "bg-zinc-900 text-white", fallback: "F" },
  github: { icon: GithubIcon, className: "bg-zinc-900 text-white", fallback: "G" },
  gitlab: { icon: GitlabIcon, className: "bg-amber-600 text-white", fallback: "G" },
  google: { icon: GoogleIcon, className: "bg-sky-600 text-white", fallback: "G" },
  meta: { icon: MetaIcon, className: "bg-blue-600 text-white", fallback: "M" },
  microsoft: { icon: MicrosoftIcon, className: "bg-emerald-600 text-white", fallback: "M" },
  notion: { icon: NotionIcon, className: "bg-zinc-900 text-white", fallback: "N" },
  paypal: { icon: PaypalIcon, className: "bg-indigo-600 text-white", fallback: "P" },
  shopify: { icon: ShopifyIcon, className: "bg-lime-600 text-white", fallback: "S" },
  slack: { icon: SlackIcon, className: "bg-fuchsia-600 text-white", fallback: "S" },
  spotify: { icon: SpotifyIcon, className: "bg-green-600 text-white", fallback: "S" },
  stripe: { icon: StripeIcon, className: "bg-indigo-600 text-white", fallback: "S" },
}

const DEFAULT_BRAND: CompanyBrandPresentation = {
  className: "bg-muted text-muted-foreground",
  fallback: "C",
}

export function getCompanyBrandPresentation(companyId: string, companyName: string) {
  const preset = COMPANY_BRAND_BY_ID[companyId]
  if (preset) return preset

  return {
    ...DEFAULT_BRAND,
    fallback: companyName.charAt(0).toUpperCase() || DEFAULT_BRAND.fallback,
  }
}
