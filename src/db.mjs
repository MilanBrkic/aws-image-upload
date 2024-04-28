import pg from "pg";

export async function dbConnect() {
  const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };

  const client = new pg.Client(config);

  await client.connect();
  return client;
}

/**
 *
 * @param {pg.Client} client
 */
export async function createTable(client) {
  await client.query(`
        CREATE TABLE IF NOT EXISTS image(
          image_id uuid NOT NULL,
          filename TEXT NOT NULL,
          content_type TEXT NOT NULL,
          PRIMARY KEY (image_id)
        );
  `);
}

/**
 *
 * @param {pg.Client} client
 */
export async function insertImage(imageId, filename, contentType) {
  const client = await dbConnect();

  await createTable(client);

  await client.query(
    `
      INSERT INTO image
      VALUES($1,$2,$3);
    `,
    [imageId, filename, contentType]
  );

  await client.end();
}
