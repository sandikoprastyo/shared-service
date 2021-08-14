import { SharedServiceWorker } from '@shared-service/core';
import localforage from 'localforage';

console.log('worker');

const sharedService = new SharedServiceWorker({
  tasks: [
    { id: 0, name: "Eat", completed: true },
    { id: 1, name: "Sleep", completed: false },
    { id: 2, name: "Repeat", completed: false }
  ],
});

/*global onconnect*/
onconnect = function(e) {
  sharedService.onConnect(e);
};

async function initStorage() {
  const storage = localforage.createInstance({
    name: 'todoData',
  });
  await storage.ready();
  const keys = await storage.keys();
  console.log(keys);
  const promises = keys.map((key) =>
    storage.getItem(key).then((data) => {
      console.log(key, data);
      sharedService.setState(key, data);
    }),
  );
  await Promise.all(promises);
  sharedService.on('stateChange', ({ key, state }) => {
    storage.setItem(key, state);
  });
}

initStorage();
