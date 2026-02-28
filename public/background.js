let storedResume = null;
let storedFileName = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "CHECK_SCORE") {
        callApi(message, sendResponse);

        return true;
    }

    if (message.type === "RESUME") {
        storedResume = message.base64;
        storedFileName = message.fileName;
        storedResult = null;
        return;
    }

    if (message.type === "GET_RESULT") {
        sendResponse({
            result: storedResult,
            fileName: storedFileName
        });
    }

    if (message.type === "CLEAR_RESULT") {
        storedResult = null;
        storedResume = null;
    }
})


let storedResult = null;

async function callApi(message, sendResponse) {

    if (!storedResume) {
        sendResponse("Upload the resume");
        return;
    }

    try {
        const apiData = await fetch('https://resume-matcher-backend-production-a84f.up.railway.app/send', {
            method: "POST",
            body: JSON.stringify({ jd: message.discription, base64: storedResume }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await apiData.json()

        storedResult = data.response;

        sendResponse(data.response.score)
    } catch (err) {
        console.log(err)
    }
}






