// Gemini API 라이브러리를 불러옵니다.
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Netlify의 환경 변수에서 API 키를 안전하게 가져옵니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Netlify 함수는 항상 이 형식으로 작성합니다.
exports.handler = async (event) => {
  try {
    // URL에서 온도 값을 가져옵니다. (예: ?temp=23)
    const temp = event.queryStringParameters.temp || "15"; // 기본값 15도

    // AI 모델을 선택합니다. (수정된 부분)
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

    // AI에게 보낼 명령어 (프롬프트)
    const prompt = `${temp}도 날씨에 어울리는 옷차림을 스타일리시하게 2~3줄로 설명해줘.`;

    // AI에게 프롬프트를 보내고 결과를 생성합니다.
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 성공적으로 생성된 텍스트를 반환합니다.
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // 모든 사이트에서 이 함수를 호출할 수 있도록 허용
      },
      body: JSON.stringify({ outfit: text }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "옷차림 설명을 생성하는 데 실패했습니다." }),
    };
  }
};