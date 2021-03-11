const express = require('express');
const app = express();
const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

app.use(express.json());

app.use(express.static('pages'))
//Google Cloud Environments
process.env.GOOGLE_CLOUD_PROJECT = "my-project";
process.env.GOOGLE_APPLICATION_CREDENTIALS = "path/to/my/key.json";

app.get('/stops', async (req,res)=> {
    res.send(await query());
    });

async function query() {
    // Queries the view to get stops along the route.

    const query = `SELECT coords FROM \`my_dataset.vw_stops\` LIMIT 1`;

    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
      query: query,
      // Location must match that of the dataset(s) referenced in the query.
      location: 'US',
    };

    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

    // return the results
    return rows[0].coords;
  }
  // [END bigquery_query]
  //query();

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 4545;
app.listen(port, () => console.log(`Listening on port ${port}..`));
