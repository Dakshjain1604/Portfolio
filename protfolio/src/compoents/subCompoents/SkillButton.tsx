import { ReactElement } from "react";

interface Skills{
    logo:ReactElement,
    text:string,
}

export function SkillBox(props:Skills){
    return <div className="flex justify-center items-center content-center rounded-3xl shadow-lg shadow-gray-800 bg-black text-white p-4 w-fit h-fit hover:scale-105 ">
        <div className="pr-3">{props.logo}</div><div>{props.text}</div>
    </div>
}



