// 파일: netlify/functions/generate-outfit.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {

  // --- 진단용 코드 시작 ---
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    console.log("읽어들인 API 키의 앞 5자리:", apiKey.substring(0, 5));
    console.log("읽어들인 API 키의 뒤 5자리:", apiKey.slice(-5));
    console.log("읽어들인 API 키의 길이:", apiKey.length);
  } else {
    console.log("읽어들인 API 키: 없음 (undefined)");
  }
  // --- 진단용 코드 끝 ---

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const temp = event.queryStringParameters.temp || "15";
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
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
    console.error(error); // 이 부분은 원래 오류 메시지를 보여줍니다.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "옷차림 설명을 생성하는 데 실패했습니다." }),
    };
  }
};