/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import tree from 'tree-node-cli';

const fileTree = tree('../', {
  allFile: true,
  exclude: [/node_modules/, /dist/],
});

console.log(fileTree);
