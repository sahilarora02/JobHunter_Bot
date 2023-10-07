const fs = require('fs');
const Cheerio = require("cheerio");
const fetch = require("node-fetch");
const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config();
async function searchPost() {
  try {
    const res = await fetch("https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=Software%2BDevelopment&location=Delhi%2C%2BIndia&geoId=106187582&trk=public_jobs_jobs-search-bar_search-submit&start=25", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "csrf-token": "ajax:0927536956846882029",
        "sec-ch-ua": "\"Google Chrome\";v=\"117\", \"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"117\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "cookie": "bcookie=\"v=2&ddafe79e-1b97-482d-82f4-94c5d352a443\"; bscookie=\"v=1&202307161737290ed570d7-993d-4a44-825a-693847b14f50AQF1GcZ6P8MMNB6sa8I4vnOUrwQebS2z\"; li_theme=light; li_theme_set=app; li_sugr=1af75e80-60bd-4633-946e-9da25fb36fe2; _guid=1bdf5f51-9427-4513-983d-1105b48cff1a; aam_uuid=48250712794344510932896103874690794099; visit=v=1&M; _gcl_au=1.1.1964574353.1691811696; timezone=Asia/Calcutta; AnalyticsSyncHistory=AQK58ax_BYP17gAAAYsII8knJFPp-iSrhwytwFEvxS4xDLzpnhGkc-51vfvrEtvGuFc2ussHg12EwBsfufOMeg; lms_ads=AQHYYUys1cpQlAAAAYsII8pttwE8BBaeOjs5ybiSKG3gsApNLUCZpZlCTThhgwq_mAW_rOQK7ham9cfgKMzRdbihR5YgbRBO; lms_analytics=AQHYYUys1cpQlAAAAYsII8pttwE8BBaeOjs5ybiSKG3gsApNLUCZpZlCTThhgwq_mAW_rOQK7ham9cfgKMzRdbihR5YgbRBO; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19638%7CMCMID%7C47719068489065255342953842512892080568%7CMCAAMLH-1697277988%7C12%7CMCAAMB-1697277988%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1696680388s%7CNONE%7CMCCIDH%7C1807167712%7CvVersion%7C5.1.1; ln_or=eyI0MzQ2MTM3IjoiZCJ9; UserMatchHistory=AQIPFvGmmOhtiAAAAYsJ9FUykFeBHMsyuCfB9yyY6KloEAygJ0lLtXoAcv6vg58OJXRjpBv7o7tfjnwFZJUi566D-h-8q_xKd8niHF_AtDBjfLFvHygvXFMwf2gn4kY_45AzC3fusZfN8YhAI-v7mg5I6p-YfadSuV1XsDmi5fy5jCfAMFBOQSIqYK8rrW5OFSFykGqmz_aN7ix4Qt4e_OtfbHPeS7iDx_hlxEeAtL50Ju39CMpBZXNjGAaQ5pafPjTTn8Z6FtS4tbifqU3x4i7OKd2FpFLYXsabWS7dLaJx2vSBLXLu03WV5jMsd2k5W0Lpmhc48nFiHavDDptIKSpk49KTblg; sdsc=22%3A1%2C1696679091736%7EJAPP%2C0CzK0G%2BR5kYXTxBMFvgSMs4Y0D6w%3D; li_rm=AQE26GjBzwYVyAAAAYsJ9KzoWsDpUpD2BItziwnDdtfmn5Z0yen7p2c5z3bQQ4Bb74Hm95B39jtoB2IoefRHDfGc2h8ObbSdw6X1qgJ8RFeeyS15eE_fUpGHOCl2rTkjSczGf9dyRBFYUGtV_v7EWn-y6lZmyMcRGs_pw7gI7aRaxwXI2hf86Lr9ABu9wNWp8BNBpGdCwd90GTshQr75x1gVNn5F_AwLTpfJqq4gZWI7lpIrG_3jSy_Ni5TLoz8gOCA_wYeRNRQ7LPFPtgO7AEAMzYw6wh-OL851LP96_4i5eZHVcENmrAWfGxmZzU4swxpQ-OrstmpW90QVxqo; li_g_recent_logout=v=1&true; lang=v=2&lang=en-us; lidc=\"b=VGST04:s=V:r=V:a=V:p=V:g=3012:u=1:x=1:i=1696679113:t=1696765513:v=2:sig=AQFtxxktZTseiOP_nADDZn-qp-QWPLF0\"; JSESSIONID=\"ajax:0927536956846882029\"; g_state={\"i_l\":1,\"i_p\":1696686319371}; recent_history=AQEnyKWgPWtyDQAAAYsJ9cqmZxEFcRI5JbElUntOaLlthL4nF-6Bf8pxjzZQyYINkLORX-Efa-dxDK0kC5LBNcz3EK_B8a32n_zjvAw26CLle6OFgw6A20VwYL5z9i6514zazoleNEd4WVB3FRRQIsYskZ5UMfkiLxpLKwFRmdaXpwV2kBsNjbPn-GTNy2stIV2Ygim0n2qz1xGprq071_iE-Dr_BtJOg9nkMuMawcAlSqQjuh2I_tm72Wlef1tl0BbeA-0JgnCB3uV5k_Qq6rkq_HMt28iQMtzze1rMSWsHnThtjQ_yc4Hvc6D_bS6cRS2oW5-3HFN6MjwhNpXynt5PBn-M8zclzMr5aI9OLlClP7xNMO1Kl3F8VsC5tlbA-uu9Sxs9T836l2pH0scAOS1LQBMSyHd0byZS6YBnwLEUqOHvDS9xaZMc9p-NAYRgwA",
        "Referer": "https://www.linkedin.com/jobs/search?keywords=Software%20Development&location=Delhi%2C%20India&geoId=106187582&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    });
    const html = await res.text();
    const $ = Cheerio.load(html);
    const json = [];
    const jobs = $(".job-search-card");
    jobs.each((i,job)=>{
      const id = $(job).attr("data-entity-urn")?.split(":")?.[3];
      const title = $(job).find(".base-search-card__title")?.text()?.trim();
      const company = $(job).find(".base-search-card__subtitle")?.text()?.trim();
      const link = $(job).find("a").attr("href")?.split("?")[0];
      const location = $(job).find(".job-search-card__location").text().trim();
      json.push({id,title,company,link,location});
    });
    return json;
  } catch (err) {
    console.log("error in catch->", err.message);
  }
}

async function fetchDataAndSaveToExcel() {
  const search = await searchPost();
  sendEmailWithAttachment(search)
}

async function sendEmailWithAttachment(search) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.SERVICE_EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const generateJobListingTable = (data) => {
    let tableHTML = `
      <table>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Company</th>
          <th>Location</th>
          <th>Link</th>
        </tr>
    `;
  
    data.forEach((job) => {
      tableHTML += `
        <tr>
          <td>${job.id}</td>
          <td>${job.title}</td>
          <td>${job.company}</td>
          <td>${job.location}</td>
          <td><a href="${job.link}">Apply</a></td>
        </tr>
      `;
    });
  
    tableHTML += '</table>';
    return tableHTML;
  };
  
  const emailContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h1>Job Listings</h1>
        ${generateJobListingTable(search)}
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.SERVICE_EMAIL,
    to: process.env.TO_EMAIL, 
    subject: 'Daily Jobs Data',
    html: emailContent,
  };
  await transporter.sendMail(mailOptions);
}
cron.schedule('0 9 * * *', () => {
  fetchDataAndSaveToExcel();
}, {
  timezone: 'Asia/Kolkata' 
});