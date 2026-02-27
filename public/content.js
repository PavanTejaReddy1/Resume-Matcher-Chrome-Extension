let tooltip;

document.addEventListener("mouseup",()=>{
    
    const selectedText = window.getSelection().toString().trim()

    if (selectedText.length > 50) {
        createTooltip(selectedText)
    }      
})

document.addEventListener("mousedown", (e) => {
    if (tooltip && !tooltip.contains(e.target)) {
        tooltip.remove();
    }
});

function createTooltip(selectedText){
    if(tooltip){
        tooltip.remove()
    }

    tooltip = document.createElement("div");
    tooltip.innerText = "Check Score";

    tooltip.style.position = "absolute"; 
    tooltip.style.background = "#1f1f1f";
    tooltip.style.color = "#ffffff";
    tooltip.style.padding = "10px 16px";
    tooltip.style.borderRadius = "8px";
    tooltip.style.fontSize = "14px";
    tooltip.style.fontWeight = "500";
    tooltip.style.fontFamily = "Segoe UI, sans-serif";
    tooltip.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
    tooltip.style.zIndex = "9999";
    tooltip.style.cursor = "pointer";

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    tooltip.style.top = `${rect.bottom + window.scrollY}px`;
    tooltip.style.left = `${rect.left + window.scrollX}px`;

    document.body.appendChild(tooltip);

    tooltip.onclick = () => {
        tooltip.innerText = "Loading..."

        chrome.runtime.sendMessage({
            type : "CHECK_SCORE",
            discription : selectedText
        },
        (response) => {
            tooltip.innerText = response;
        })
    }
}
