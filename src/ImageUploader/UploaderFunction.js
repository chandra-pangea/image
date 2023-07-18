import { BlobServiceClient } from '@azure/storage-blob';




const sasToken ='sp=rw&st=2023-05-25T11:33:01Z&se=2024-05-26T07:30:00Z&sv=2022-11-02&sr=c&sig=ykcmpwbTsK6FibdhH%2B5sNZhiMzEG%2BDaMZBKTjVZxIsU%3D'; // Fill string with your SAS token
const storageAccountName = 'nxgcertstorageaccount'; // Fill string with your Storage resource name
const containerName =  'nxg-dev'|| 'plainxblob';

const createBlobInContainer = async (containerClient, file, setProgress) => {
    //TODO: Add a token generator here
    const token = 'skdjasbnjksbvjdfabvjbjdfbvjdv'; //crypto.randomBytes(20).toString('hex');
    const blobClient = containerClient.getBlockBlobClient(`${token}_${file.name.replaceAll(/\s/g, "_")}`);
    const options = { blobHTTPHeaders: { blobContentType: file.type }, onProgress: (ev) => setProgress(ev.loadedBytes) };
    try {
        await blobClient.uploadBrowserData(file, options);
        await blobClient.setMetadata({ status: 'inprogress' });
        return blobClient;
    } catch (error) {
        console.log({ error });
    }
};

const uploadFileToBlob = async (file, setProgress) => {
    // get BlobService - notice `?` is pulled out of sasToken - if created in Azure portal
    const blobService = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net/?${sasToken}`);
    // get Container - full public read access
    const containerClient = blobService.getContainerClient(containerName);
    // upload file
    try {
        const blobClient = await createBlobInContainer(containerClient, file, setProgress);
        if (!!blobClient) {
            return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobClient.name}`;
        }
    } catch (error) {
        console.log(error);
    }
};

export const getFileDetails = async (file, setProgress) => {
    return uploadFileToBlob(file, setProgress).then((dataUrl) => {
        let fileDetails = {
            fileURL: dataUrl,
            fileSize: file.size,
            fileName: file.name,
        };
        return fileDetails;
    });
};