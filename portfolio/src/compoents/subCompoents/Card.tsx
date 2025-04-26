import { MouseEventHandler } from "react";
import { Github } from "../../icons/github";

interface card {
    title: string,
    image?: string,
    onClick?: MouseEventHandler,
}

export function Card(props: card) {
    return (
        <div className="text-white flex flex-col rounded-md w-80  sm:w-100 h-fit border-2 p-2 border-gray-800 md:w-120">
            <div className="flex justify-between py-3 px-2 ">
                <div className="text-3xl font-bold">
                    {props.title}
                </div>
                <div onClick={props.onClick} className="hover:scale-125" >
                    {<Github height={30} width={30} />}
                </div>
            </div>
            <div className="pt-3">
                <img src={props.image} className="rounded-lg shadow-lg shadow-gray-400">
                </img>
            </div>
        </div>
    );
}

