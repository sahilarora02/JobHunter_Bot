

// async function fetchDataAndSaveToExcel() {
//   const search = await searchPost();
//   sendEmailWithAttachment(search)
// }

// async function sendEmailWithAttachment(search) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.SERVICE_EMAIL,
//       pass: process.env.PASSWORD,
//     },
//   });

//   const generateJobListingTable = (data) => {
//     let tableHTML = `
//       <table>
//         <tr>
//           <th>ID</th>
//           <th>Title</th>
//           <th>Company</th>
//           <th>Location</th>
//           <th>Link</th>
//         </tr>
//     `;

//     data.forEach((job) => {
//       tableHTML += `
//         <tr>
//           <td>${job.id}</td>
//           <td>${job.title}</td>
//           <td>${job.company}</td>
//           <td>${job.location}</td>
//           <td><a href="${job.link}">Apply</a></td>
//         </tr>
//       `;
//     });

//     tableHTML += '</table>';
//     return tableHTML;
//   };

//   const emailContent = `
//     <html>
//       <head>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//           }
//           table {
//             border-collapse: collapse;
//             width: 100%;
//           }
//           th, td {
//             border: 1px solid #dddddd;
//             text-align: left;
//             padding: 8px;
//           }
//           th {
//             background-color: #f2f2f2;
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Job Listings</h1>
//         ${generateJobListingTable(search)}
//       </body>
//     </html>
//   `;

//   const mailOptions = {
//     from: process.env.SERVICE_EMAIL,
//     to: process.env.TO_EMAIL,
//     subject: 'Daily Jobs Data',
//     html: emailContent,
//   };
//   await transporter.sendMail(mailOptions);
// }
// cron.schedule('0 9 * * *', () => {
//   fetchDataAndSaveToExcel();
// }, {
//   timezone: 'Asia/Kolkata'
// });

// const search = searchPost();
// console.log("search->", search);
