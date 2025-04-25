interface expData {
  company: string;
  logo?: string;
  position: string;
  learning?: string[];
  tech?: string[];
  date: string;
}
export function ExperienceCard(props: expData) {
  return (
    <div className="flex flex-col text-white shadow-2xl shadow-gray-400 border-2 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex">
          <div className=" font-semibold text-3xl pr-2">{props.position}</div>
          <div className="text-2xl ">@{" " + props.company}</div>
        </div>
        <div className="text-2xl ">
            {props.date}
        </div>
      </div>
      <div className="pt-5 pl-5 text-lg">
        <polyline></polyline>
        {props.learning}
      </div>
    </div>
  );
}
