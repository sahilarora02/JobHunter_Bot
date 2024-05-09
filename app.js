const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
require('dotenv').config();
const PORT = process.env.PORT || 4002;
console.log(process.env.MONGO_URI)
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// MongoDB Model for storing email addresses
const SubscriberModel = mongoose.model("Subscriber", {
  email: {
    type: String,
    require:true,
   unique:true
  },
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get("/latest-jobs", async (req, res) => {
  try {
    const jobsData = await searchPost();
    res.json(jobsData);
  } catch (error) {
    console.error("Error fetching latest jobs:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  try {
    const alreadySubscribed = await SubscriberModel.findOne({email: email});
    if(alreadySubscribed) return res.status(409).json({message:"Already Subscribed"})
    await SubscriberModel.create({ email });
   return res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error subscribing:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/unsubscribe", async (req, res) => {
  const { email } = req.body;

  try {
    const alreadySubscribed = await SubscriberModel.findOne({email: email});
    if(!alreadySubscribed) return res.status(404).json({message:"You have not subscribed to use"})
    await SubscriberModel.findOneAndDelete({email: email});
   return res.status(200).json({ message: "Unsubscribed succesfull" });
  } catch (error) {
    console.error("Error subscribing:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log("Server started and running on port", PORT);
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "sahilaroraji2002@gmail.com",
    pass: "kasv zmey ojnx sisi",
  },
});

async function sendEmailWithJobListings(subscribers, jobListings) {
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
        ${generateJobListingTable(jobListings)}
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.SERVICE_EMAIL,
    subject: 'Daily Jobs Data',
    html: emailContent,
  };

  for (const subscriber of subscribers) {
    mailOptions.to = subscriber.email;
    await transporter.sendMail(mailOptions);
  }
}

// Schedule cron job to send emails at 9 AM daily
cron.schedule('0 9 * * *', async () => {
  try {
    const subscribers = await SubscriberModel.find({}, { _id: 0, email: 1 });
    const jobsData = await searchPost();
    await sendEmailWithJobListings(subscribers, jobsData);
  } catch (error) {
    console.error('Error in cron job:', error.message);
  }
}, {
  timezone: 'Asia/Kolkata',
});


async function searchPost() {
  try {
    const res = await fetch(
      "https://in.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=Software%2BDevelopment&location=Delhi%2C%2BIndia&locationId=&geoId=106187582&f_TPR=r86400&start=0",
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "csrf-token": "ajax:6402797847549255079",
          "sec-ch-ua":
            '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          cookie:
            'lang=v=2&lang=en-us; bcookie="v=2&17ca0de2-0d40-42fd-88c3-6e9b6a6e75c8"; lidc="b=OGST09:s=O:r=O:a=O:p=O:g=2707:u=1:x=1:i=1706815253:t=1706901653:v=2:sig=AQFwNFGEE18ViCC0c0E7BLOIBzz8ixOq"; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19755%7CMCMID%7C89379025090399892634208657771163074739%7CMCAAMLH-1707420054%7C12%7CMCAAMB-1707420054%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1706822454s%7CNONE%7CvVersion%7C5.1.1; aam_uuid=89911219493727277484226356453946831736; _gcl_au=1.1.1262780752.1706815259; JSESSIONID=ajax:6402797847549255079; bscookie="v=1&2024020119542142795047-ef57-48f0-828a-ff071e56dc7aAQGcaiuY5GXSlGnrR6gzuci0znXacS1_"; aam_uuid=89911219493727277484226356453946831736; recent_history=AQGkgR3cRft0owAAAY1mPTWrv5tzY4g8z3VJh3TqlZggWhhAx5163J9kDnL7faoBQkv8C9W6KYT8CWM56n7VvvsuDk1s4Ul5MQOt-XDx8CwAPHmR2q-FR71OKyGwMjG4SOect0_18q-3FeJfMhTmueyv5X8sOYHq2Gl6WZTR_eq09H63TOANDM39CFCuRpWaaSkGww2f1vnCcqdicEPc_RrqepC1HRnnkE_CtOrhJYqmIHjyoKMd3mqvU1vNGPUc9_2KhrQQyYUJE7kwnvKDmYY2nvO0If9lUuJtjaIlFmxnbuoauSdLNQVmHPWdYhVn3rWbDUx6b60Fn8EQYEoFI7eKmvvPDFTeyq-rzdDiOe12xv4VubpMCJsGm_vK5c4koDELx2WCxlqRLSGk_Zw1DwJokC0HTxxm8tGrz8-avgL3nDKVPYIJ5FTZXXWzzpVlRZ9Jz65dxEv7wJr71B0JJ0I; _uetsid=07807170c13711eea026b7b7566139ff; _uetvid=078093c0c13711eea90d77f9d04d93ef',
          Referer:
            "https://in.linkedin.com/jobs/search?keywords=Software%20Development&location=Delhi%2C%20India&locationId=&geoId=106187582&f_TPR=r86400&position=1&pageNum=0",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );
    const html = await res.text();
    const $ = cheerio.load(html);
    const json = [];
    const jobs = $(".job-search-card");
    jobs.each((i, job) => {
      const id = $(job).attr("data-entity-urn")?.split(":")?.[3];
      const title = $(job).find(".base-search-card__title")?.text()?.trim();
      const company = $(job)
        .find(".base-search-card__subtitle")
        ?.text()
        ?.trim();
      const link = $(job).find("a").attr("href")?.split("?")[0];
      const location = $(job).find(".job-search-card__location").text().trim();
      json.push({ id, title, company, link, location });
    });
    console.log(json);
    return json;
  } catch (err) {
    console.log("error in catch->", err.message);
  }
}
