// Gemini API 라이브러리를 불러옵니다.
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  // 진단용 코드는 이제 필요 없으므로 원래 코드로 되돌립니다.
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const temp = event.queryStringParameters.temp || "15";

    // AI 모델을 안정적인 버전으로 최종 수정합니다.
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

    const prompt = `${temp}도 날씨에 어울리는 옷차림을 스타일리시하게 2~3줄로 설명해줘.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
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