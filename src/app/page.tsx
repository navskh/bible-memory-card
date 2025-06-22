import InteractiveBibleCard from "@/components/elements/interactive-bible-card";
import PWAInstallPrompt from "@/components/elements/pwa-install-prompt";
import ServiceWorkerRegister from "@/components/elements/service-worker-register";

export default function Page() {
  return (
    <>
      <InteractiveBibleCard />
      <PWAInstallPrompt />
      <ServiceWorkerRegister />
    </>
  )
}
