import { ReaderView } from "@/components/reader/ReaderView"
import { DesktopShell } from "@/components/shell/DesktopShell"

/**
 * Server component. ReaderView is real semantic HTML, always in the DOM,
 * server-rendered - the SEO payload and the no-JS path. DesktopShell is
 * the client-only OS simulation that paints over it once JS runs on a
 * desktop-width viewport. See plan/00-architecture.md section 4 and
 * plan/17-reader-view.md.
 */
export default function Page() {
  return (
    <>
      <ReaderView />
      <DesktopShell />
    </>
  )
}
