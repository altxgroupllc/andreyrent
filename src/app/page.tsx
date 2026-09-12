import { redirect } from "next/navigation";
import { DEFAULT_LOCALE, path } from "@/content/routes";

/**
 * `/` is a locale entry point only — there is no canonical content here.
 * When more locales ship, this becomes an Accept-Language negotiation.
 */
export default function RootPage() {
  redirect(path.home(DEFAULT_LOCALE));
}
