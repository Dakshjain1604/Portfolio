"use client";

import Card from "../subComponents/Card";

export function Projects() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 md:mb-12 text-center ">
        Projects
      </h2>

      <div className="w-full max-w-7xl px-0 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          <Card
            name="Transactly Payments App"
            imageSrc="/images/transactly.png"
            gitHubLink="https://github.com/Dakshjain1604/transactly_frontend/blob/main/README.md"
            liveLink="https://transactly-frontend.vercel.app/signup"
            delay={0.3}
          />

          <Card
            name="Live Tracking App"
            imageSrc="/images/live-tracking.png"
            gitHubLink="https://github.com/Dakshjain1604/Live-Tracking/tree/main"
            delay={0.4}
          />

          <Card
            name="Brainly - Personal Link Saver"
            imageSrc="/images/brainlyImages/BrainlyImage.png"
            gitHubLink="https://github.com/Dakshjain1604/Brainly"
            delay={0.5}
          />

          <Card
            name="AI Enabled Website Cloner"
            imageSrc="/images/Website_Cloner.avif"
            gitHubLink="https://github.com/Dakshjain1604/Brainly"
            AIenabled={true}
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
}