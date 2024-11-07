"use client";
import OpenAI from "openai";
import { ChatCompletion } from "openai/resources/index.mjs";
import { useState } from "react";
const spicyRateStrings = [
  "  서운한 일을 있으면 그 내용과 관련된 저자세로 슬픈 감정을 표출하거나 무조건적으로 사과해. 서운한 일과 즐거운일 간의 연관관계는 없어.  자네나 당신 보다는 너와 니 같이 구어체였으면 해. 그리고 별명을 넣으면 별명과 관련되서 대상을 칭찬해줘. 굉장히 온화하고 다정하고 귀여운 말투를 사용해줘. 근데 마지막엔 챙겨주는 말을 해줘야 돼. 인터넷 말투로",
  "  서운한 일을 있으면 그 내용과 관련된 슬픈 감정을 표출하거나 사과해. 서운한 일과 즐거운일 간의 연관관계는 없어. 그리고 별명을 넣으면 별명을 언급해줘. 조금 다정한 말투로 해줘.           자네나 당신 보다는 너와 니 같이 구어체였으면 해. 근데 마지막엔 챙겨주는 말을 해줘야 돼. 인터넷 말투로",
  "  서운한 일을 있으면 그 내용과 관련된 슬픈 감정을 표출하거나 그것에 대한  사과와 위로를 같이 넣어줘.  서운한 일과 즐거운일 간의 연관관계는 없어. 그리고 별명을 넣으면 별명과 관련되서 대상을 놀려줘.           자네나 당신 보다는 너와 니 같이 구어체였으면 해. 굉장히 짜증나고 무례한 말투와 반말로 글을 써줘.",
  " 상대는 완전히 병신이야. 특징은  안좋은 쪽으로 생각해야돼.  서운한 일을 있으면 그 내용과 관련된 슬픈 감정을 표출하거나 그것에 대한  사과와 위로를 같이 넣어줘.  서운한 일과 즐거운일 간의 연관관계는 없어.  그리고 별명을 넣으면 별명과 관련되서 대상을 놀려줘. 너는  ㅅㅂ ㅂㅅ이야. 병신 같은 욕도 섞고 굉장히 무례하고 짜증나는 말투로 글을 써줘. ",
];
export default function Home() {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
    project: process.env.OPEN_AI_PROJECT_KEY,
    dangerouslyAllowBrowser: true,
  });
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [histories, setHistories] = useState<string[]>([]);
  const [characteristic, setCharacteristic] = useState("");
  const [goodMemory, setGoodMemory] = useState("");
  const [badMemory, setBadMemory] = useState("");
  const [spicyRate, setSpicyRate] = useState(0);
  const [nick, setNick] = useState("");
  const [answer, setAnswer] = useState<ChatCompletion>();
  const onSubmitMessage = async () => {
    const message =
      (name ? `대상 이름:${name}\n` : "") +
      (characteristic ? `특징:${characteristic}\n` : "") +
      (goodMemory ? `좋은기억:${goodMemory}\n` : "") +
      (badMemory ? `서운한일:${badMemory}\n` : "") +
      (nick ? `별명:${nick}` : "");
    if (message) {
      setIsLoading(true);
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",

        messages: [
          {
            role: "system",
            content: `너는 지금부터 이 프롬프트를 입력하고 있는 *나*야. 

            너는  대상 에게 2025년 새해인사 편지를 쓸거야.  
            대상과는 아는 사이야.
            대상 이름을 받으면 한국의 새해인사를 해줘.  
            특징을 받으면 특징은 칭찬 혹은 위로만 해줘야됨.
            즐거웠던 일을 써주면 그 내용과 관련된 추억팔이를 같이 넣어줘. 
            ${spicyRateStrings[spicyRate]}.
            서운한 일은 너와는 연관이 없는 일이야. 
            즐거운 일도 너와는 연관이 없는 일이야.
            처음에 * gpt로 생성된 문장입니다.  넣어줘
`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      });
      setIsLoading(false);
      if (completion) {
        setHistories([
          ...histories,
          `\n${message}\n\n${completion?.choices
            ?.map((value) => value.message.content)
            .join("\n")}\n\n`,
        ]);
      }
      setAnswer(completion);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div
        className="min-h-40 whitespace-pre-line w-60 cursor-copy hover:bg-gray-700 hover:text-white"
        onClick={() => {
          navigator.clipboard.writeText(
            (
              answer?.choices?.map((value) => value.message.content || "") || []
            ).join("\n")
          );
          alert("복사완료");
        }}
      >
        {isLoading
          ? "로딩중"
          : answer?.choices.map((value) => (
              <span className=" " key={value.index}>
                {value.message.content}
              </span>
            ))}
      </div>
      <details>
        <summary>히스토리</summary>
        {histories.map((history) => (
          <p
            className="cursor-copy mt-1 whitespace-pre-line border-t-2 border-t-slate-700 hover:bg-gray-700 hover:text-white"
            key={history}
            onClick={() => {
              navigator.clipboard.writeText(history);
              alert("복사완료");
            }}
          >
            {history}
          </p>
        ))}
      </details>
      <form className="flex flex-col gap-2">
        매운정도
        <input
          type="range"
          step={1}
          max={3}
          value={spicyRate}
          onChange={(e) => {
            setSpicyRate(+e.target.value);
          }}
        />
        <div className="flex gap-2">
          <span>이름</span>{" "}
          <input
            className="text-black"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="flex gap-2">
          <span>별명</span>
          <input
            className="text-black"
            value={nick}
            onChange={(e) => {
              setNick(e.target.value);
            }}
          />
        </div>
        <div className="flex gap-2">
          <span>특징</span>{" "}
          <input
            className="text-black"
            value={characteristic}
            onChange={(e) => {
              setCharacteristic(e.target.value);
            }}
          />
        </div>
        <div className="flex gap-2">
          <span>좋았던 일</span>{" "}
          <input
            className="text-black"
            value={goodMemory}
            onChange={(e) => {
              setGoodMemory(e.target.value);
            }}
          />
        </div>
        <div className="flex gap-2">
          <span>서운한 일 </span>{" "}
          <input
            className="text-black"
            value={badMemory}
            onChange={(e) => {
              setBadMemory(e.target.value);
            }}
          />
        </div>
        <button type="button" onClick={onSubmitMessage}>
          보내기
        </button>
      </form>
    </div>
  );
}
