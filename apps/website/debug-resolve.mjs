import { createRequire } from 'module';
const require = createRequire(import.meta.url);
try {
  console.log('Resolving next-intl:', require.resolve('next-intl'));
} catch (e) {
  console.error('Failed to resolve next-intl:', e.message);
}
