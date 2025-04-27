interface exp {
  title: string;
  company: string;
  description: string;
  image: string;
  date:string
}

export function ExperienceCard(props: exp) {
  return (
    <div className="w-full border-white rounded-xl px-20 pb-10 shadow-gray-300 shadow-md text-gray-300 mt-10">
      <div className="flex flex-row justify-between py-5 px-5 mt-4 text-3xl rounded-xl shadow-md shadow-gray-600 mb-5 ">
        <div className="flex align-baseline">
          <div className="font-bold">{props.title}</div>
          <div className="pl-2 ">| {props.company}</div>
        </div>
        <div>
          <div className="text-xl "> {props.date}</div>
        </div>
      </div>
      <div className="h-[60%] pt-5 indent-2 flex justify-evenly shadow-md shadow-gray-600 rounded-xl px-10 pb-10">
        <div className="text-justify text-gray-400 pr-10 text-lg">{props.description}</div>
        <div className="bg-gray-300 rounded-xl h-fit ">
          <img src={props.image}></img>
        </div>
      </div>
    </div>
  );
}
