import * as fs from 'fs'
import * as path from 'path'
import { CHAIN_IDS, SOURCE_CHAINS, type EvmChain, type SourceChain } from './chains'
import type { TokenData, TokenList, TokenListToken } from './types'

const DATA_DIR = path.join(__dirname, '..', 'data')
const OUTPUT_FILE = path.join(__dirname, '..', 'megaeth.tokenlist.json')
const LOGO_BASE_URL =
  'https://raw.githubusercontent.com/megaeth-labs/mega-tokenlist/main/data'

const CANONICAL_BRIDGES = new Set([
  '0x4200000000000000000000000000000000000010',
  '0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75',
  '0x7f82f57F0Dd546519324392e408b01fcC7D709e8',
])

function getLogoExtension(tokenDir: string): string | null {
  const svgPath = path.join(tokenDir, 'logo.svg')
  const pngPath = path.join(tokenDir, 'logo.png')

  if (fs.existsSync(svgPath)) return 'svg'
  if (fs.existsSync(pngPath)) return 'png'
  return null
}

function readTokenData(symbol: string): TokenData {
  const dataPath = path.join(DATA_DIR, symbol, 'data.json')
  const content = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(content) as TokenData
}

// Find source chain info (non-EVM chains like Solana) for a token
function findSourceChain(tokenData: TokenData): { chain: string; address: string } | null {
  for (const [chain, chainToken] of Object.entries(tokenData.tokens)) {
    if (SOURCE_CHAINS.includes(chain as SourceChain) && chainToken?.address) {
      return {
        chain: chain, // Use lowercase chain key as identifier (e.g., "solana")
        address: chainToken.address,
      }
    }
  }
  return null
}

export function generate(): TokenList {
  // Read all token directories
  const tokenDirs = fs
    .readdirSync(DATA_DIR)
    .filter((name) => {
      const stat = fs.statSync(path.join(DATA_DIR, name))
      return stat.isDirectory()
    })
    .sort()

  const tokens: TokenListToken[] = []

  for (const symbol of tokenDirs) {
    const tokenDir = path.join(DATA_DIR, symbol)
    const tokenData = readTokenData(symbol)
    const logoExt = getLogoExtension(tokenDir)
    const sourceChain = findSourceChain(tokenData)

    // Create token entries for each chain
    for (const [chain, chainToken] of Object.entries(tokenData.tokens)) {
      if (!chainToken?.address) continue

      const chainId = CHAIN_IDS[chain as EvmChain]
      if (!chainId) continue

      // Build extensions object
      const extensions: TokenListToken['extensions'] = {
        isNative: chainToken.isNative ?? 'unknown',
        isOFT: chainToken.isOFT ?? 'unknown',
      }

      // Add bridge info if present
      if (chainToken.bridge) {
        extensions.bridgeAddress = chainToken.bridge
        extensions.bridgeType = CANONICAL_BRIDGES.has(chainToken.bridge)
          ? 'canonical'
          : 'others'
      }

      // Add source chain info if this token is bridged from a non-EVM chain
      if (sourceChain) {
        extensions.sourceChain = sourceChain.chain
        extensions.sourceAddress = sourceChain.address
      }

      const token: TokenListToken = {
        chainId,
        address: chainToken.address,
        name: tokenData.name,
        symbol: tokenData.symbol,
        decimals: tokenData.decimals,
        extensions,
      }

      if (logoExt) {
        token.logoURI = `${LOGO_BASE_URL}/${symbol}/logo.${logoExt}`
      }

      tokens.push(token)
    }
  }

  // Sort tokens by chainId, then symbol
  tokens.sort((a, b) => {
    if (a.chainId !== b.chainId) return a.chainId - b.chainId
    return a.symbol.localeCompare(b.symbol)
  })

  const tokenList: TokenList = {
    name: 'MegaETH Token List',
    timestamp: new Date().toISOString(),
    version: {
      major: 1,
      minor: 0,
      patch: 0,
    },
    tokens,
  }

  return tokenList
}

// Main execution
if (require.main === module) {
  const tokenList = generate()
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tokenList, null, 2))
  console.log(`Generated ${OUTPUT_FILE} with ${tokenList.tokens.length} tokens`)
}
