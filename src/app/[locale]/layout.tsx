import { notFound } from "next/navigation";
import { LOCALES, isLocale, path } from "@/content/routes";
import { getDictionary } from "@/content/i18n";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { t } from "@/components/system/tokens";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);

  const nav = [
    { href: path.home(locale), label: d.nav.home },
    { href: path.bikes(locale), label: d.nav.booking },
    { href: path.prices(locale), label: d.nav.prices },
    { href: path.howItWorks(locale), label: d.nav.howItWorks },
    { href: path.delivery(locale), label: d.nav.delivery },
    { href: path.contacts(locale), label: d.nav.contacts },
  ];

  const footerNav = [
    ...nav,
    { href: path.cars(locale), label: d.nav.cars },
    { href: path.bicycles(locale), label: d.nav.bicycles },
  ];

  return (
    <div className="flex min-h-screen flex-col" style={{ background: t.page, color: t.text }}>
      <SiteHeader
        locale={locale}
        brandLine={d.brandLine}
        labels={{
          search: d.nav.search,
          searchModel: d.nav.searchModel,
          menu: d.nav.menu,
          closeMenu: d.nav.closeMenu,
          whatsapp: d.nav.whatsapp,
        }}
        nav={nav}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} labels={{ rights: d.footer.rights, hours: d.footer.hours }} nav={footerNav} />
    </div>
  );
}
