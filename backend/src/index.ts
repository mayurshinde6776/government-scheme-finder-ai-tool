import 'dotenv/config';
import app from './api/app';

const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  console.log(`[backend] listening on http://localhost:${port}`);
});
