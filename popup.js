document.addEventListener('DOMContentLoaded', async () => {
    const chatInfoEl = document.getElementById('chatInfo');
    const errorMsgEl = document.getElementById('errorMsg');
    const exportBtn = document.getElementById('exportBtn');
  
    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
      if (!tab || !tab.url) {
        chatInfoEl.textContent = "No active tab or URL not found.";
        exportBtn.disabled = true;
        return;
      }
  
      // Check if we're on chat.openai.com or chatgpt.com
      const urlLower = tab.url.toLowerCase();
      const isChatGPTDomain = (
        urlLower.includes("chat.openai.com") ||
        urlLower.includes("chatgpt.com")
      );
  
      if (!isChatGPTDomain) {
        chatInfoEl.textContent = "This tab is not on a ChatGPT domain.";
        exportBtn.disabled = true;
        return;
      }
  
      // Attempt to parse conversation ID from URL (handles /chat/... or /c/...)
      let conversationId = "";
      try {
        const urlObj = new URL(tab.url);
        const pathParts = urlObj.pathname.split('/'); 
        // e.g. ['', 'chat', '123abc...'] or ['', 'c', '123abc...']
  
        // /chat/<id> case
        if (pathParts.length >= 3 && pathParts[1] === 'chat') {
          conversationId = pathParts[2] || "";
        }
        // /c/<id> case
        else if (pathParts.length >= 3 && pathParts[1] === 'c') {
          conversationId = pathParts[2] || "";
        }
      } catch (err) {
        console.warn("Failed to parse conversation ID:", err);
      }
  
      if (conversationId) {
        chatInfoEl.textContent = `Chat ID: ${conversationId}`;
      } else {
        chatInfoEl.textContent = "Detected ChatGPT domain, but no conversation ID found.";
      }
  
      // When user clicks the button -> inject scripts
      exportBtn.addEventListener('click', () => {
        // You can also do error handling if needed
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: [
            'libs/jspdf.umd.min.js',      // 1) define window.jspdf.jsPDF
            'libs/html2canvas.min.js',    // 2) define window.html2canvas
            'libs/html2pdf.bundle.min.js',           // 3) old code that expects window.jsPDF
            'content-script.js'           // 4) bridging fix + your old code usage
          ]
        });
      });
  
    } catch (err) {
      console.error(err);
      chatInfoEl.textContent = "Error occurred. Check console.";
      errorMsgEl.textContent = err.toString();
      errorMsgEl.style.display = 'block';
    }
  });
  
  