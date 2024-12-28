// 1. Select all ChatGPT bubbles
const bubbleEls = Array.from(document.querySelectorAll('[data-message-author-role]'));

(async function() {
  // 2. Basic PDF options
  const pdfOptions = {
    margin: 0.3, // smaller outer margin
    filename: 'chatgpt-conversation.pdf',
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  // 3. If no bubbles found, exit
  if (bubbleEls.length === 0) {
    alert("No bubbles found; can't create PDF.");
    return;
  }

  console.log("[Debug] Building multi-page PDF from", bubbleEls.length, "bubbles.");

  // 4. Helper function to wrap each bubble’s raw HTML in style overrides
  function wrapBubbleHTML(bubbleEl) {
    // Identify role for debugging or labeling
    const roleAttr = bubbleEl.getAttribute('data-message-author-role');
    let role = 'Unknown';
    if (roleAttr === 'assistant') role = 'ChatGPT';
    else if (roleAttr === 'user') role = 'User';

    // Grab bubble content (e.g. .markdown or entire bubble)
    // If you prefer .markdown only:
    // const markdownEl = bubbleEl.querySelector('.markdown');
    // const bubbleContent = markdownEl ? markdownEl.innerHTML.trim() : bubbleEl.innerHTML.trim();
    const bubbleContent = bubbleEl.innerHTML.trim();

    // Style override: force black text, reduce spacing, override .markdown margins, etc.
    const styleOverride = `
      <style>
        /* Force everything to black, override any inline color */
        * {
          color: black !important;
        }
        /* Reduce paragraph spacing in .markdown, if present */
        .markdown p {
          margin: 0.4em 0 !important;
        }
        /* Example: line-height, etc. */
        body, .markdown {
          line-height: 1.2 !important;
          font-family: sans-serif !important;
        }
      </style>
    `;

    // Combine style + minimal wrapper
    // Also label the role if you like
    const finalHTML = `
      ${styleOverride}
      <div style="font-family:sans-serif; line-height:1.2;">
        <strong style="display:block; margin-bottom:0.25em;">${role}</strong>
        <div>${bubbleContent}</div>
      </div>
    `;
    return finalHTML;
  }

  // 5. Start the worker with the *first* bubble
  let worker = html2pdf()
    .set(pdfOptions)
    .from(wrapBubbleHTML(bubbleEls[0])) // "Load" the first bubble’s HTML
    .toContainer()
    .toCanvas()
    .toPdf(); // That’s our Page 1

  // 6. For each subsequent bubble, add a new page and render it
  if (bubbleEls.length > 1) {
    bubbleEls.slice(1).forEach((bubble, index) => {
      worker = worker
        .get('pdf')
        .then(pdf => {
          pdf.addPage(); // new blank PDF page
        })
        .from(wrapBubbleHTML(bubble))  // load next bubble’s HTML
        .toContainer()
        .toCanvas()
        .toPdf();
    });
  }

  // 7. Finally, save the PDF once everything is appended
  worker = worker
    .get('pdf')
    .then(pdf => {
      console.log("[Debug] Finished building multi-page PDF; now saving...");
    })
    .save()
    .then(() => {
      console.log("[Debug] PDF saved successfully (multi-page).");
    })
    .catch(err => {
      console.error("[Debug] Error generating multi-page PDF:", err);
      alert("Failed to generate multi-page PDF. Check console for details.");
    });
})();



// // For ChatGPT, you'd do something like:
// const bubbleEls = Array.from(document.querySelectorAll('[data-message-author-role]'));

// (async function() {
//     // Basic pdf options
//     const pdfOptions = {
//       margin: 0.5,
//       filename: 'chatgpt-conversation.pdf',
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//     };
  
//     // If no bubbles found, exit
//     if (bubbleEls.length === 0) {
//       alert("No bubbles found; can't create PDF.");
//       return;
//     }
  
//     console.log("[Debug] Building PDF from multiple elements:", bubbleEls.length);
  
//     // 1. Start the worker with the first bubble
//     let worker = html2pdf()
//       .set(pdfOptions)
//       .from(bubbleEls[0])         // "Load" first bubble
//       .toContainer()
//       .toCanvas()
//       .toPdf();                   // Now we have 1 page in the PDF
  
//     // 2. For each subsequent bubble, add a new page and render it
//     if (bubbleEls.length > 1) {
//       bubbleEls.slice(1).forEach((bubble, index) => {
//         worker = worker
//           .get('pdf')
//           .then(pdf => {
//             // Add a new page for each subsequent bubble
//             pdf.addPage();
//           })
//           .from(bubble)          // load the next bubble
//           .toContainer()
//           .toCanvas()
//           .toPdf();
//       });
//     }
  
//     // 3. Finally, save the PDF once everything is appended
//     worker = worker
//       .get('pdf')
//       .then(pdf => {
//         console.log("[Debug] Finished building multi-page PDF; now saving...");
//       })
//       .save()
//       .then(() => {
//         console.log("[Debug] PDF saved successfully (multi-page).");
//       })
//       .catch(err => {
//         console.error("[Debug] Error generating multi-page PDF:", err);
//         alert("Failed to generate multi-page PDF. See console for details.");
//       });
//   })();


// (async function () {
//     console.log("[Debug] Content script running: Attempting to scrape ChatGPT messages...");
  
//     // 1. Grab all message bubbles with data-message-author-role
//     const messageBubbles = document.querySelectorAll('[data-message-author-role]');
//     console.log("[Debug] Found", messageBubbles.length, "message bubbles.");
  
//     if (!messageBubbles.length) {
//       alert("No messages found. The DOM structure may have changed, or you haven't scrolled up.");
//       return;
//     }
  
//     // 2. Build an HTML string for the conversation
//     let conversationHTML = `<div style="font-family: sans-serif; color: #000;">`;
  
//     messageBubbles.forEach((bubble, index) => {
//       // Determine role
//       const roleAttr = bubble.getAttribute('data-message-author-role');
//       let role = 'Unknown';
//       if (roleAttr === 'assistant') {
//         role = 'ChatGPT';
//       } else if (roleAttr === 'user') {
//         role = 'User';
//       }
  
//       // Attempt to get content from .markdown
//       const markdownEl = bubble.querySelector('.markdown');
//       const bubbleContentHTML = markdownEl
//         ? markdownEl.innerHTML.trim()
//         : bubble.innerHTML.trim();
  
//       console.log(`[Debug] Bubble #${index} [role=${role}]:`, bubbleContentHTML);
  
//       conversationHTML += `
//         <div style="margin-bottom: 1.5em; border-bottom: 1px solid #ccc; padding-bottom: 1em;">
//           <div style="font-weight: bold; margin-bottom: 6px;">${role}</div>
//           <div>${bubbleContentHTML}</div>
//         </div>
//       `;
//     });
  
//     conversationHTML += `</div>`;
//     console.log("[Debug] Final conversationHTML length:", conversationHTML.length);
//     console.log("[Debug] conversationHTML:", conversationHTML);

//     try {
//         const worker = html2pdf().from(conversationHTML).set({
//             margin: 0.5,
//             filename: 'chatgpt-conversation.pdf',
//             html2canvas: {scale: 2},
//             jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'
//             }
//         });
    
//         // Step by Step
//         // a) .toContainer()
//         await worker.toContainer();
//         console.log('[Debug] Completed toContainer()');
    
//         // b) .toCanvas()
//         await worker.toCanvas();
//         console.log('[Debug] Completed toCanvas()');
    
//         // c) .toImg()
//         await worker.toImg();
//         console.log('[Debug] Completed toImg()');
    
//         // d) .toPdf()
//         const pdfObject = await worker.toPdf();
//         console.log('[Debug] Completed toPdf()', pdfObject);
    
//         // e) .save()  (or .outputPdf() if you want a data string)
//         await worker.save();
//         console.log('[Debug] PDF saved successfully.');
//     } catch (err) {
//         console.error('[Debug] Error generating PDF:', err);
//         alert('Failed to generate PDF. See console for detail');
//     }
//   })();
  
  
  
  