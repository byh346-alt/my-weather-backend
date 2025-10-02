// 파일: netlify/functions/generate-outfit.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const temp = event.queryStringParameters.temp || "15";

    // AI 모델을 가장 기본적인 'gemini-pro'로 최종 수정합니다.
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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