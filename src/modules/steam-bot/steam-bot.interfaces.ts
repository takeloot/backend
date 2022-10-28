export interface ISteamEconItem {
  assetid: string;
  appid: number;
}

export interface ISteamBotOptions {
  accountName: string;
  password: string;
  proxy?: string;
}

export interface ISendTradeOfferOptions {
  identitySecret?: string;
  cookies: string[];
  partner: string;
  theirItems?: ISteamEconItem[];
  myItems?: ISteamEconItem[];
}

export interface ISendTradeOfferResult {
  tradeId: string;
  status: 'pending' | 'sent';
  myItems: ISteamEconItem[];
}

export interface IGetTradeOfferOptions {
  tradeId: string;
  cookies: string[];
}
