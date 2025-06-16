"use client";
import Card from "../subComponents/Card";
export function Projects() {
  return (
    <div className="flex flex-col items-center h-screen pt-50 justify-center">
      <div className="text-6xl font-bold ">Projects</div>
      <div>
        <div className="flex justify-center items-center mt-20 gap-10">
          <Card
            name="Transactly Payments App"
            imageSrc="images/transactly.png"
            gitHubLink={
              "https://github.com/Dakshjain1604/transactly_frontend/blob/main/README.md"
            }
            liveLink={"https://transactly-frontend.vercel.app/signup"}
          />
          <Card
            name="Live Tracking App"
            imageSrc="images/live-tracking.png"
            gitHubLink={
              "https://github.com/Dakshjain1604/Live-Tracking/tree/main"
            }
          />
          <Card
            name="Brainly - Personal Link Saver"
            imageSrc="images/brainlyImages/BrainlyImage.png"
            gitHubLink={"https://github.com/Dakshjain1604/Brainly"}
          />
        </div>
        <div className="flex mt-10 justify-center">
        <Card
            name="AI Enabled Website Cloner"
            imageSrc="images/Website_Cloner.avif"
            gitHubLink={"https://github.com/Dakshjain1604/Brainly"}
            AIenabled={true}
          />
        </div>
      </div>
    </div>
  );
}
