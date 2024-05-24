import { Worker } from 'worker_threads';

async function createUUIDAsync() {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js');
        worker.on('message', (uuid) => {
            resolve(uuid);
            worker.terminate();
        });

        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });

        worker.postMessage('createUUID');
    });
}

export async function workerFactory() {
    try {
        const uuid = await createUUIDAsync();
        return uuid;
    } catch (error) {
        console.error('Error:', error);
    }
}

