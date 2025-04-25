import { BottomBar } from "../compoents/BottomBar";
import { Headerbar } from "../compoents/topBar";

export function GetinTouch() {
  return (
    <div className="flex flex-col justify-center items-center pb-70">
      <div className="text-9xl font-bold flex justify-center text-gray-400 pb-5">
        {" "}
        GET IN TOUCH
      </div>
      <div className="rounded-3xl h-fit w-fit border-gray-300 border-2 p-1 hover:scale-110 text-white" onClick={()=>{
          window.open("https://mail.google.com/mail/u/0/#inbox?compose=CllgCJNvMZDCbHbrHplLnvQpFQCgzcbVXzLFxsfvLLjBdfQpCBpMCTsQfgZQknBgQgRTcGWmhsB","_blank");
        }}>
        {" "}
        dakshjain080@gmail.com
      </div>
    </div>
  );
}

export function ContactBottomBar() {
  return (
    <div className="bg-gray-800 border w-full h-full text-white">
      <div className="flex flex-col justify-center items-center">
        <div className="pt-10 text-2xl font-semibold">Contact Me</div>
        <div className="text-center text-lg text-gray-400">
          I’m always open to new opportunities,
          exciting collaborations, or
          just
          <br/>a friendly hello.
        </div>
        <div ><BottomBar/></div>
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <div className="bg-black h-[100vh]">
      <Headerbar />
      <div className="pt-50 flex flex-col justify-between">
        {" "}
        <GetinTouch />
        <ContactBottomBar />
      </div>
    </div>
  );
}
