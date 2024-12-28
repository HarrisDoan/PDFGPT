# PDFGPT
I'm developing an open-source tool to let students save ChatGPT logs as PDFs for free, removing the paywall barrier on a potential educational resource such as ChatGPT.

Notice:
This development was only possible with tools such as html2pdf and jsPDF. 

Link to jsPDF: https://github.com/parallax/jsPDF
Link to html2pdf: https://github.com/spipu/html2pdf

Thank you to all the contributors who have made all of this possible. 

Motivations:
While I was studying for my CS118 Final, I compiled a huge ChatGPT log with like 8 weeks of lectures summarized and I was basically self teaching myself everything. However, I wanted to save this as a PDF since we were allowed to bring notes for the final. Come to find out the only thing out there for converting ChatGPT logs to PDF easily costs money. It was a free trial of like two downloads and then paywall. I am all for making money on your business ideas, but something like ChatGPT is such a key and game changing educational tool that kids will be using for a long time. It is the new Chegg. It is a tutor without having to pay a tutor. Allow for people to use their chat logs as a learning resource should not be held behind an economic barrier. So my goal is to make something completely open source and free.

Overview:
So, right now its very basic in functionality. If the chat logs with ChatGPT is only plaintext it works fine. I need to add more logic to handle things such as: images, tables, code snippets, and etc. And then clean up stuff in general. 

To Do List:
- Add image handling
- Add table handling
- Add code snippet handling
- Adjust gap so the PDF doesn't take up a billion pages
