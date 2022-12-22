import { User } from "discord-types/general";
import { Injector, webpack, common } from "replugged";
import { getBadges } from "./customBadges";
const { React } = common;
const inject = new Injector();

interface BadgeArgs {
  guildId: string;
  user: User;
}

type BadgeMod = (args: BadgeArgs) => React.ReactElement<{
  children: React.ReactElement[];
  className: string;
}>;

interface CustomBadges {
  [key: string]: any;
  aliu: {
    dev: boolean;
    donor: boolean;
    contributor: boolean;
    custom: {
      url: string;
      name: string;
    } | boolean;
  };
  bd: {
    dev: boolean;
  };
  enmity: {
    supporter: {
      data: {
        name: string;
        id: string;
        url: {
          dark: string;
          light: string;
        }
      };
    }
  };
  goosemod: {
    sponsor: boolean;
    dev: boolean;
    translator: boolean;
  };
}

type BadgeCache = {
  badges: CustomBadges;
  lastFetch: number;
};

const cache = new Map<string, BadgeCache>();
const REFRESH_INTERVAL = 1000 * 60 * 30;

export async function start(): Promise<void> {
  const mod = await webpack.waitForModule<Record<string, BadgeMod>>(
    webpack.filters.bySource(".GUILD_BOOSTER_LEVEL_1,"),
  );
  const fnPropName = Object.entries(mod).find(([_, v]) => typeof v === "function")?.[0];
  if (!fnPropName) {
    throw new Error("Could not find badges function");
  }
  const Badge = await getBadges();

  inject.after(
    mod,
    fnPropName,
    (
      [
        {
          user: { id },
        },
      ],
      res,
    ) => {
      if (!res?.props?.children) return res;

      const [badges, setBadges] = React.useState<CustomBadges | null>(null);

      async function fetchBadges(id: string): Promise<CustomBadges> {
        if (!cache.has(id) || cache.get(id)!.lastFetch < Date.now() - REFRESH_INTERVAL) {
          const res = await fetch(`https://api.obamabot.me/v2/text/badges?user=${id}`);
          const body = (await res.json()) as Record<string, unknown> & { badges: CustomBadges };

          const result: BadgeCache =
            res.status === 200 || res.status === 404
              ? { badges: body || {}, lastFetch: Date.now() }
              : (cache.delete(id), { badges: {}, lastFetch: Date.now() });

          cache.set(id, result);
        }

        setBadges(cache.get(id)?.badges || null);
        return cache.get(id)!.badges;
      }

      React.useEffect(() => {
        (async () => {
          await fetchBadges(id);
        })();
      }, []);

      if (!badges) return res;

      const { containerWithContent } = webpack.getByProps("containerWithContent") as Record<
        string,
        string
      >;

      const badgeTypes = [
        { condition: badges.aliu.dev, element: <Badge.aliucordDeveloper /> },
        { condition: badges.aliu.contributor, element: <Badge.alucordContributors /> },
        { condition: badges.aliu.donor, element: <Badge.aliucordDonor /> },
        {
          condition: typeof badges.aliu.custom === "object" && badges.aliu.custom != null,
          element: <Badge.aliucordCustom url={badges.aliu.custom?.url} name={badges.aliu.custom?.text} />,
        },
        { condition: badges.bd.dev, element: <Badge.bdDevs /> },
        { condition: badges.enmity && badges.enmity.supporter, element: <Badge.enmityDevs url={badges.enmity?.supporter?.data.url.dark} name={badges.enmity?.supporter?.data.name} /> },
        { condition: badges.goosemod.dev, element: <Badge.gooseModDeveloper /> },
        { condition: badges.goosemod.sponsor, element: <Badge.gooseModSponsor /> },
        { condition: badges.goosemod.translator, element: <Badge.gooseModTranslator /> },
      ];
      
      badgeTypes.forEach(({ condition, element }) => {
        if (condition) {
          res.props.children.push(element);
        }
      });
      

      

      if (res.props.children.length > 0) {
        if (!res.props.className.includes(containerWithContent)) {
          res.props.className += ` ${containerWithContent}`;
        }
        if (!res.props.className.includes("global-badges-container")) {
          res.props.className += " global-badges-container";
        }
      }

      return res;
    },
  );
}

export function stop(): void {
  inject.uninjectAll();
}
