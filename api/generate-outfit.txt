// 파일: api/generate-outfit.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Vercel의 환경 변수에서 API 키를 안전하게 가져옵니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Vercel 함수의 기본 형식
export default async function handler(request, response) {
  try {
    // URL에서 온도 값을 가져옵니다. (예: ?temp=23)
    const temp = request.query.temp || "15"; // 기본값 15도

    // AI 모델을 선택합니다.
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // AI에게 보낼 명령어 (프롬프트)
    const prompt = `${temp}도 날씨에 어울리는 옷차림을 스타일리시하게 2~3줄로 설명해줘.`;

    // AI에게 프롬프트를 보내고 결과를 생성합니다.
    const result = await model.generateContent(prompt);
    const resultResponse = await result.response;
    const text = resultResponse.text();

    // 성공적으로 생성된 텍스트를 JSON 형태로 반환합니다.
    response.status(200).json({ outfit: text });

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "옷차림 설명을 생성하는 데 실패했습니다." });
  }
}