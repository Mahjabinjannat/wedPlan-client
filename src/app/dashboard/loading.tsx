// Next.js wraps this folder's page in <Suspense> and shows this while it loads.
// Each dashboard page folder has its own loading.tsx, because moving between
// dashboard pages only re-renders the page part (Next.js 16 instant navigation).
export { default } from "@/components/dashboard/DashboardPageLoading";
