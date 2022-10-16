import {
  IGetTradeOfferOptions,
  ISendTradeOfferOptions,
  ISendTradeOfferResult,
  ISteamBotOptions,
  ISteamEconItem,
} from './steam-bot.interfaces';

import { EGame } from '@takeloot/dto';

import SteamCommunity from 'steamcommunity';
import SteamTOTP from 'steam-totp';
import TradeOfferManager from 'steam-tradeoffer-manager';
import Request from 'request';

export class SteamBot {
  private accountName: string;
  private password: string;
  private proxy: string;
  private steamCommunity;

  constructor(options?: ISteamBotOptions) {
    if (options) {
      const { accountName, password, proxy } = options;

      this.accountName = accountName;
      this.password = password;
      if (proxy) this.proxy = proxy;
    }
  }

  public async login({ sharedSecret }) {
    const twoFactorCode = await new Promise((resolve, reject) =>
      // @ts-ignore
      SteamTOTP.getAuthCode(sharedSecret, (err, code) => {
        if (err) reject(err);
        else resolve(code);
      }),
    );

    const steamCommunityOptions: Record<string, any> = {};
    if (this.proxy) {
      steamCommunityOptions.request = Request.defaults({ proxy: this.proxy });
    }

    // @ts-ignore
    this.steamCommunity = new SteamCommunity(steamCommunityOptions);
    return new Promise<string[]>((resolve, reject) => {
      this.steamCommunity.login(
        {
          accountName: this.accountName,
          password: this.password,
          twoFactorCode,
        },
        (err, sessionId, cookies: string[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(cookies);
          }
        },
      );
    });
  }

  public getAccountInfo() {
    return new Promise<any>((resolve, reject) => {
      this.steamCommunity.getSteamUser(
        this.steamCommunity.steamID,
        (err, info) => {
          if (err) {
            reject(err);
          } else {
            const name = info.name;
            // Work in progress
            // const avatar = info.getAvatarUrl('medium', 'https://');
            const avatar = null;
            const profileUrl =
              'https://steamcommunity.com/profiles/' +
              info.steamID.getSteamID64();

            resolve({ name, avatar, profileUrl });
          }
        },
      );
    });
  }

  // Work in progress
  // public getTradeUrl() {
  //   const steamCommunityOptions: Record<string, any> = {};
  //   if (this.proxy) {
  //     steamCommunityOptions.request = Request.defaults({ proxy: this.proxy });
  //   }

  //   // @ts-ignore
  //   this.steamCommunity = new SteamCommunity(steamCommunityOptions);

  //   return new Promise<string>((resolve, reject) => {
  //     this.steamCommunity.getTradeUrl((err, url) => {
  //       if (err) reject(err);
  //       else resolve(url);
  //     });
  //   });
  // }

  public async getInventoryItems(cookies: string[], game: EGame) {
    const manager = new TradeOfferManager({
      language: 'en',
    });

    await new Promise<void>((resolve, reject) => {
      manager.setCookies(cookies, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return new Promise<ISteamEconItem[]>((resolve, reject) => {
      manager.getInventoryContents(game, 2, true, (err, inventory) => {
        if (err) reject(err);
        else {
          manager.shutdown();
          resolve(inventory);
        }
      });
    });
  }

  public async sendTradeOffer(options: ISendTradeOfferOptions) {
    const { partner, theirItems, myItems, cookies, identitySecret } = options;
    const community = new SteamCommunity();
    community.setCookies(cookies);

    const manager = new TradeOfferManager({
      community,
      language: 'en',
    });

    const offer = manager.createOffer(partner);
    offer.addTheirItems(theirItems);
    offer.addMyItems(myItems);

    return new Promise<ISendTradeOfferResult>((resolve, reject) => {
      offer.send((err, status) => {
        if (err) {
          reject(err);
        } else {
          if (identitySecret && myItems?.length) {
            community.acceptConfirmationForObject(
              identitySecret,
              offer.id,
              (err) => {
                if (err) reject(err);
                else resolve({ tradeId: offer.id, status: 'sent', myItems });
              },
            );
          } else {
            resolve({ tradeId: offer.id, status, myItems });
          }
        }
      });
    });
  }

  public async getTradeOffer(options: IGetTradeOfferOptions) {
    const { tradeId, cookies } = options;
    const manager = new TradeOfferManager({
      language: 'en',
      pollInterval: -1,
    });

    await new Promise<void>((resolve, reject) => {
      manager.setCookies(cookies, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return new Promise<any>((resolve, reject) => {
      manager.getOffer(tradeId, (err, offer) => {
        if (err) {
          reject(err);
        } else {
          resolve(offer);
        }
      });
    });
  }

  public async cancelTradeOffer(options) {
    const { tradeId, cookies } = options;
    const manager = new TradeOfferManager({
      language: 'en',
      pollInterval: -1,
    });

    await new Promise<void>((resolve, reject) => {
      manager.setCookies(cookies, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return new Promise<void>((resolve, reject) => {
      manager.getOffer(tradeId, (err, offer) => {
        if (err) {
          reject(err);
        } else {
          offer.cancel((err) => {
            if (err) reject(err);
            else {
              manager.shutdown();
              resolve();
            }
          });
        }
      });
    });
  }

  public async checkTradeOfferLink(tradeOfferLink: string, cookies: string[]) {
    const tradeOfferManager = new TradeOfferManager({
      language: 'en',
      pollInterval: -1,
    });

    await new Promise<void>((resolve) => {
      tradeOfferManager.setCookies(cookies, () => {
        resolve();
      });
    });

    const tradeOffer = tradeOfferManager.createOffer(tradeOfferLink);
    await new Promise<void>((resolve, reject) => {
      tradeOffer.getUserDetails((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    tradeOfferManager.shutdown();
  }
}
