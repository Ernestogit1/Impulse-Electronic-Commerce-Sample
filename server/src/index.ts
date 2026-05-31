import { createApp } from './app';
import { env, useMongo, useFirebase } from './config/env';
import { connectDatabase } from './config/db';
import { initFirebaseAdmin } from './config/firebaseAdmin';

async function bootstrap() {
  await initFirebaseAdmin();
  await connectDatabase();

  const app = createApp();
  app.listen(env.port, () => {
    console.log('\n  ⚡  Impulse Storefront API');
    console.log(`  ➜  http://localhost:${env.port}/api/v1`);
    console.log(`  ➜  data:    ${useMongo ? 'MongoDB' : 'in-memory (demo)'}`);
    console.log(`  ➜  auth:    ${useFirebase ? 'Firebase' : 'demo tokens'}`);
    console.log(`  ➜  payments: ${env.paymentProvider}\n`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
