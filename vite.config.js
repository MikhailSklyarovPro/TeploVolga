export default {
  root: 'src', // корень - папка src
  publicDir: '../public', // выносим статику на уровень выше
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
};
