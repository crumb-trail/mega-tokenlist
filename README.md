# MegaETH Token List

The official token registry for the MegaETH ecosystem. This repository maintains a curated list of tokens deployed on MegaETH and their corresponding addresses on other chains for bridging and cross-chain tracking.

The generated tokenlist follows the [Uniswap Token List](https://github.com/Uniswap/token-lists) standard with MegaETH-specific extensions.

## Supported Chains

| Chain    | Chain ID | Type   | Description                              |
| -------- | -------- | ------ | ---------------------------------------- |
| Ethereum | 1        | L1     | Ethereum mainnet                         |
| MegaETH  | 4326     | L2     | MegaETH mainnet                          |
| Solana   | -        | Source | Non-EVM source chain for bridged assets  |

> **Note:** Only EVM chains (Ethereum, MegaETH) appear in the generated tokenlist. Non-EVM chains like Solana are tracked as source chains — their addresses are included in the `extensions` field for reference.

---

## Adding a Token

### 1. Create Token Folder

Create a folder under `data/` using your token symbol:

```
data/
└── WETH/
    ├── data.json
    └── logo.svg
```

### 2. Add Token Data

Create `data.json` with your token information:

```json
{
  "name": "Wrapped Ether",
  "symbol": "WETH",
  "decimals": 18,
  "tokens": {
    "ethereum": {
      "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    },
    "megaeth": {
      "address": "0x4200000000000000000000000000000000000006"
    }
  }
}
```

### 3. Add Logo

Add a `logo.svg` or `logo.png` file (256×256 recommended).

### Requirements

- Token must be deployed on at least one supported chain
- Logo must be SVG or PNG format, minimum 200×200px
- EVM addresses must be checksummed ([EIP-55](https://eips.ethereum.org/EIPS/eip-55))

---

## Token Data Schema

### Basic Fields

| Field      | Type   | Required | Description                    |
| ---------- | ------ | -------- | ------------------------------ |
| `name`     | string | ✓        | Full token name                |
| `symbol`   | string | ✓        | Token ticker symbol            |
| `decimals` | number | ✓        | Token decimal places           |
| `description` | string |       | Token description (max 1000 chars) |
| `website`  | string |          | Project website URL            |

### Chain-Specific Fields

Each chain entry in `tokens` supports:

| Field      | Type    | Description                                      |
| ---------- | ------- | ------------------------------------------------ |
| `address`  | string  | Token contract address                           |
| `bridge`   | string  | Bridge contract address (if token is bridged)    |
| `isNative` | boolean | `true` if token is native to this chain          |
| `isOFT`    | boolean | `true` if token is a LayerZero OFT               |

---

## Examples

### Native Token (exists on both chains)

A token that exists natively on both Ethereum and MegaETH:

```json
{
  "name": "Cap USD",
  "symbol": "CUSD",
  "decimals": 18,
  "tokens": {
    "ethereum": {
      "address": "0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC",
      "isNative": true,
      "isOFT": true
    },
    "megaeth": {
      "address": "0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC",
      "isNative": true,
      "isOFT": true
    }
  }
}
```

### Bridged Token (from Ethereum)

A token bridged from Ethereum to MegaETH:

```json
{
  "name": "Wrapped liquid staked Ether 2.0",
  "symbol": "wstETH",
  "decimals": 18,
  "tokens": {
    "ethereum": {
      "address": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
      "isNative": true
    },
    "megaeth": {
      "address": "0x601aC63637933D88285A025C685AC4e9a92a98dA",
      "bridge": "0x1ba9bE96A5c21dcdB9D22bEC3f00abCb6336fd65",
      "isNative": false
    }
  }
}
```

### Bridged Token (from Solana)

A token bridged from a non-EVM chain like Solana:

```json
{
  "name": "Wrapped SOL",
  "symbol": "WSOL",
  "decimals": 9,
  "tokens": {
    "solana": {
      "address": "So11111111111111111111111111111111111111112"
    },
    "megaeth": {
      "address": "0x9a96E366F6b2ED5850A38B58D355a80aFD998411",
      "bridge": "0xWormholeBridgeAddress...",
      "isNative": false
    }
  }
}
```

---

## Generated Output

The tokenlist generator produces `megaeth.tokenlist.json` following the Uniswap standard with extensions.

### Token Entry Structure

```json
{
  "chainId": 4326,
  "address": "0x...",
  "name": "Token Name",
  "symbol": "TKN",
  "decimals": 18,
  "logoURI": "https://raw.githubusercontent.com/megaeth-labs/mega-tokenlist/main/data/TKN/logo.svg",
  "extensions": {
    "isNative": true,
    "isOFT": false
  }
}
```

### Extensions Reference

The `extensions` object contains MegaETH-specific metadata:

| Field           | Type    | Description                                        |
| --------------- | ------- | -------------------------------------------------- |
| `isNative`      | boolean \| `"unknown"` | Whether token is native to this chain   |
| `isOFT`         | boolean \| `"unknown"` | Whether token is a LayerZero OFT        |
| `bridgeAddress` | string  | Bridge contract used to mint this token            |
| `bridgeType`    | string  | `"canonical"` (official MegaETH bridge) or `"others"` |
| `sourceChain`   | string  | Source chain for non-EVM bridged tokens (e.g., `"solana"`) |
| `sourceAddress` | string  | Token address on the source chain                  |

### Extension Examples

**Native token on MegaETH:**
```json
{
  "extensions": {
    "isNative": true,
    "isOFT": false
  }
}
```

**Token bridged via canonical bridge:**
```json
{
  "extensions": {
    "isNative": false,
    "isOFT": false,
    "bridgeAddress": "0x4200000000000000000000000000000000000010",
    "bridgeType": "canonical"
  }
}
```

**LayerZero OFT token:**
```json
{
  "extensions": {
    "isNative": false,
    "isOFT": true,
    "bridgeAddress": "0x...",
    "bridgeType": "others"
  }
}
```

**Token bridged from Solana:**
```json
{
  "extensions": {
    "isNative": false,
    "isOFT": false,
    "sourceChain": "solana",
    "sourceAddress": "So11111111111111111111111111111111111111112"
  }
}
```

---

## Development

### Prerequisites

- Node.js >= 18
- pnpm

### Setup

```bash
pnpm install
```

### Generate Token List

```bash
pnpm generate
```

This creates `megaeth.tokenlist.json` in the project root.

### Run Tests

```bash
pnpm test
```

---

## Full Output Example

```json
{
  "name": "MegaETH Token List",
  "timestamp": "2025-01-05T00:00:00.000Z",
  "version": {
    "major": 1,
    "minor": 0,
    "patch": 0
  },
  "tokens": [
    {
      "chainId": 1,
      "address": "0x0000000000000000000000000000000000000000",
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "logoURI": "https://raw.githubusercontent.com/megaeth-labs/mega-tokenlist/main/data/ETH/logo.svg",
      "extensions": {
        "isNative": true,
        "isOFT": false,
        "bridgeAddress": "0x0CA3A2FBC3D770b578223FBB6b062fa875a2eE75",
        "bridgeType": "canonical"
      }
    },
    {
      "chainId": 4326,
      "address": "0x0000000000000000000000000000000000000000",
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "logoURI": "https://raw.githubusercontent.com/megaeth-labs/mega-tokenlist/main/data/ETH/logo.svg",
      "extensions": {
        "isNative": true,
        "isOFT": false,
        "bridgeAddress": "0x4200000000000000000000000000000000000010",
        "bridgeType": "canonical"
      }
    }
  ]
}
```

---

## License

MIT
