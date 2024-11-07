import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
const spicyRateStrings = [
  " 서운한 일을 있으면 그 내용과 관련된 저자세로 슬픈 감정을 표출하거나 무조건적으로 사과해. 서운한 일과 즐거운일 간의 연관관계는 없어.  자네나 당신 보다는 너와 니 같이 구어체였으면 해. 그리고 별명을 넣으면 별명과 관련되서 대상을 칭찬해줘. 굉장히 온화하고 다정하고 귀여운 말투를 사용해줘. 근데 마지막엔 챙겨주는 말을 해줘야 돼. 인터넷 말투로",
  " 서운한 일을 있으면 그 내용과 관련된 슬픈 감정을 표출하거나 사과해. 서운한 일과 즐거운일 간의 연관관계는 없어. 그리고 별명을 넣으면 별명을 언급해줘. 조금 다정한 말투로 해줘.           자네나 당신 보다는 너와 니 같이 구어체였으면 해. 근데 마지막엔 챙겨주는 말을 해줘야 돼. 인터넷 말투로",
  " 서운한 일을 있으면 그 내용과 관련된 슬픈 감정을 표출하거나 그것에 대한  사과와 위로를 같이 넣어줘.  서운한 일과 즐거운일 간의 연관관계는 없어. 그리고 별명을 넣으면 별명과 관련되서 대상을 놀려줘.           자네나 당신 보다는 너와 니 같이 구어체였으면 해. 굉장히 짜증나고 무례한 말투와 반말로 글을 써줘.",
  " 상대는 완전히 병신이야. 특징은  안좋은 쪽으로 생각해야돼.  서운한 일을 있으면 그 내용과 관련된 슬픈 감정을 표출하거나 그것에 대한  사과와 위로를 같이 넣어줘.  서운한 일과 즐거운일 간의 연관관계는 없어.  그리고 별명을 넣으면 별명과 관련되서 대상을 놀려줘. 너는  ㅅㅂ ㅂㅅ이야. 병신 같은 욕도 섞고 굉장히 무례하고 짜증나는 말투로 글을 써줘. ",
];
export async function POST(req: Request) {
  const { messages, spicyRate } = await req.json();

  if (messages) {
    const { spicyRate, name, characteristic, goodMemory, badMemory, nick } =
      messages;
    const prompt = `  이름: ${name},
      특징: ${characteristic},
      즐거웠던 일: ${goodMemory},
      서운한 일: ${badMemory},
      별명: ${nick}`;
    const result = await streamText({
      model: openai("gpt-4-turbo"),
      prompt,
      system: `
                너는 지금부터 이 프롬프트를 입력하고 있는 *나*야. 
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
    });

    return result.toDataStreamResponse();
  }
  return Response.json({ message: "error" });
}
