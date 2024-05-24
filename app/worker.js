import { parentPort } from 'worker_threads';

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

parentPort.on('message', (task) => {
    if (task === 'createUUID') {
        const uuid = generateUUID();
        parentPort.postMessage(uuid);
    }
});