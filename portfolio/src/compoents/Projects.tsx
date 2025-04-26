
import { Card } from "./subCompoents/Card";


export function Projects() {
    return <div className="">
        <div className="text-5xl font-semibold pt-10 pb-10 text-gray-200 flex justify-center ">PROJECTS</div>
        <div className="grid grid-col-2 px-10 sm:flex-col justify-center" >
            <div className="flex flex-col justify-center md:flex-row md:w-full gap-10 ">
            <Card title="Brainly" image="src/images/BrainlyImage.png" onClick={()=>{
                window.open("https://github.com/Dakshjain1604/Brainly","_blank")
            }}></Card>
            <Card title="Live Tracking Application" image="src/images/LiveTracking.png" onClick={()=>{
                window.open("https://github.com/Dakshjain1604/Live-Tracking","_blank");
            }}></Card>
            </div>
        </div>
    </div>
}
