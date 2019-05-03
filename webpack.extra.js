const WorkerPlugin = require('worker-plugin');
module.exports = {
  plugins: [
    new WorkerPlugin({
      globalObject: false,
      plugins: ['AngularCompilerPlugin']
    })
  ]
};
