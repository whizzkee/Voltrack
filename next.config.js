/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'raw.githubusercontent.com',
      'arweave.net',
      'www.arweave.net',
      'ipfs.io',
      'metadata.degods.com',
      'img-cdn.magiceden.dev',
      'creator-hub-prod.s3.us-east-2.amazonaws.com',
      'shdw-drive.genesysgo.net',
      'nftstorage.link'
    ],
  },
  reactStrictMode: true,
}

module.exports = nextConfig
