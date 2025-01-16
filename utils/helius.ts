import { Helius } from "helius-sdk";

const HELIUS_API_KEY = '67f88545-2b52-49a0-911b-dd938d7bd94c';
const helius = new Helius(HELIUS_API_KEY);

export async function getAssetDetails(assetId: string) {
  try {
    const response = await helius.rpc.getAsset({
      id: assetId,
      displayOptions: {
        showCollectionMetadata: true,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching asset details:', error);
    throw error;
  }
}
