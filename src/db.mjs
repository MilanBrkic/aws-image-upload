import pg from "pg";

const HOST = "imagedb.cpa86akswk7j.eu-central-1.rds.amazonaws.com";
const PORT = process.env.PORT ?? 5432;
const DATABASE = process.env.DB_NAME ?? "postgres";
const USER = process.env.DB_USER ?? "milanb";
const PASSWORD = process.env.DB_PASSWORD ?? "neka_sifra";

export async function dbConnect() {
  console.log("PROCESS ENV DB_HOST" + process.env.DB_HOST);
  const config = {
    host: HOST,
    port: PORT,
    database: DATABASE,
    user: USER,
    password: PASSWORD,
  };

  console.log(config);
  const client = new pg.Client(config);

  await client.connect();

  const res = await client.query("SELECT version()");
  console.log("RESPONSE: " + JSON.stringify(res, null, 2));
  await client.end();
}
