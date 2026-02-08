import type { Chain } from './chains'

// Bridge/token mechanism types
export type Mechanism = 'native' | 'lock' | 'mint' | 'burn'

// Token address on a specific chain
export interface Token {
  address: string
  // Origin and mechanism
  isOrigin?: boolean        // True if token was originally created on this chain
  mechanism?: Mechanism     // How tokens enter/exit this chain
  // Bridge/lockbox addresses
  bridge?: string           // Bridge/OFT endpoint for mint/burn
  lockbox?: string          // Lockbox address for lock mechanism
  // Legacy/additional flags
  isOFT?: boolean           // True if token is a LayerZero OFT
}

// Token data.json schema
export interface TokenData {
  name: string
  symbol: string
  decimals: number
  description?: string
  website?: string
  tokens: Partial<Record<Chain, Token>>
}

// Token extensions in generated output
export interface TokenExtensions {
  // Origin tracking
  isOrigin: boolean | 'unknown'         // Is this the canonical origin chain?
  originChain?: string                  // Which chain has the origin supply
  // Mechanism
  mechanism: Mechanism | 'unknown'      // How tokens move on this chain
  // Bridge info
  bridgeAddress?: string                // Mint/burn contract address
  bridgeType?: 'canonical' | 'others'   // Official MegaETH bridge vs third-party
  lockboxAddress?: string               // Where tokens are locked (if mechanism=lock)
  // Token type flags
  isOFT: boolean | 'unknown'            // LayerZero OFT token
  // Source chain for non-EVM bridged tokens
  sourceChain?: string                  // e.g., "solana"
  sourceAddress?: string                // Address on source chain
}

// Uniswap TokenList standard types
export interface TokenListToken {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI?: string
  extensions: TokenExtensions
}

export interface TokenListVersion {
  major: number
  minor: number
  patch: number
}

export interface TokenList {
  name: string
  timestamp: string
  version: TokenListVersion
  tokens: TokenListToken[]
}
